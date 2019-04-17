<template>
  <div>
    <b-row>
      <nav-side>
        <b-col>
        <div class="ml-3 mr-3 mt-3 text-left">
          <p>
            <router-link exact :to="{name: 'Applet', params: {appletId: appletUrl}}" class="link">
              About
            </router-link>
          </p>

          <p v-for="(act, index) in activityOrder" :key="index">
            <router-link
             :to="{name: 'TakeSurvey', params: {appletId: appletUrl, surveyId: act['@id']}}"
             class="link"
             v-if="visibility[index]"
             >
              <circle-progress
                :radius="20"
                :progress="progress[act['@id']]"
                :stroke="4"
                :strokeColor="complete[act['@id']] ? colors.success : colors.primary" />
              {{getName(act['@id'])}}
            </router-link>
          </p>
        </div>
        </b-col>
      </nav-side>
      <b-col>
      <div class="right-side">
      <router-view
        :user="user"
        :data="data"
        :activityOrder="activityOrder"
        :activityDisplayNames="activityDisplayNames"
        :isLoggedIn="isLoggedIn"
        :applet="applet"
        :srcUrl="srcUrl"
        :apiHost="apiHost"
        :responsesObj="responses"
        :progressObj="progress"
        :completeObj="complete"
        :nextActivity="nextActivity"
        v-on:saveResponse="saveResponse"
        v-on:saveProgress="saveProgress"
        v-on:saveComplete="saveComplete"
      >
      </router-view>
      </div>
      </b-col>
    </b-row>
  </div>
</template>
<style lang="scss">
  @import '../custom-bootstrap.scss';
  @import '../../node_modules/bootstrap/scss/bootstrap.scss';

  .right-side {
    overflow-y: auto;
  }

  .link.router-link-active {
    color: $dark-blue !important;
    font-weight: bold;
    font-size: 1.1em;
  }

  .link.router-link-active.complete {
    color: $green !important;
    font-weight: bold;
    font-size: 1.1em;
  }

  .link {
    color: $secondary;
  }
</style>

<script>
import jsonld from 'jsonld/dist/jsonld.min';
import axios from 'axios';
import Circle from '@bit/akeshavan.mindlogger-web.circle';
import _ from 'lodash';
import NavSide from './NavSide';
import colors from '../custom-bootstrap.scss';

function getFilename(s) {
  const folders = s.split('/');
  const N = folders.length;
  const filename = folders[N - 1].split('.')[0];
  return filename;
}

function getVariableName(s, variableMap) {
  const vmap = variableMap[0]['@list'];
  const mapper = {};
  _.map(vmap, (v) => {
    const uri = v['https://schema.repronim.org/isAbout'][0]['@id'];
    const variable = v['https://schema.repronim.org/variableName'][0]['@value'];
    mapper[uri] = variable;
  });
  return mapper[s['@id']];
}

export default {
  name: 'AppletParentRoute',
  props: {
    isLoggedIn: {
      type: Boolean,
    },
    srcUrl: {
      type: String,
    },
    user: {
      type: Object,
    },
    apiHost: {
      type: String,
    },
  },
  components: {
    NavSide,
    circleProgress: Circle,
  },
  data() {
    return {
      responses: {},
      complete: {},
      progress: {},
      data: {},
      colors,
      visibility: {},
      cache: {},
    };
  },
  mounted() {
    this.getAppletData();
  },
  computed: {
    appletUrl() {
      return this.$route.params.appletId;
    },
    applet() {
      try {
        return {
          url: this.appletUrl,
          name: this.data['http://www.w3.org/2004/02/skos/core#prefLabel'][0]['@value'],
        };
      } catch (error) {
        return {
          name: 'loading',
        };
      }
    },
    activityOrder() {
      if (this.data) {
        const tmp = this.data['https://schema.repronim.org/order'];
        if (tmp) {
          return tmp[0]['@list'];
        }
      }
      return [];
    },
    activityDisplayNames() {
      if (this.data) {
        const tmp = this.data['https://schema.repronim.org/activity_display_name'];
        if (tmp) {
          return tmp[0];
        }
      }
      return {};
    },
    nextActivity() {
      const nextObj = {};
      for (let i = 0; i < this.activityOrder.length - 1; i += 1) {
        nextObj[this.activityOrder[i]['@id']] = this.activityOrder[i + 1]['@id'];
      }
      return nextObj;
    },
    schemaNameMapper() {
      const output = {};
      if (this.activityOrder) {
        _.map(this.activityOrder, (s) => {
          let fname = '';
          if (this.data['https://schema.repronim.org/variableMap']) {
            fname = getVariableName(s, this.data['https://schema.repronim.org/variableMap']);
          } else {
            // TODO: remove this backwards compatibility else
            fname = getFilename(s);
          }
          output[fname] = s;
        });
      }
      return output;
    },
    visibilityConditions() {
      if (this.data['https://schema.repronim.org/visibility']) {
        return _.map(this.activityOrder, (s) => {
          // console.log(s);
          // TODO: don't assume the key name is the same as the ending of the filename.
          let keyName = '';
          if (this.data['https://schema.repronim.org/variableMap']) {
            keyName = getVariableName(s, this.data['https://schema.repronim.org/variableMap']);
          } else {
            // TODO: remove this backwards compatibility else
            keyName = getFilename(s);
          }

          // look through the "https://schema.repronim.org/visibility" field
          // and reformat nicely

          let condition = _.filter(this.data['https://schema.repronim.org/visibility'], c => c['@index'] === keyName);

          if (condition.length === 1) {
            condition = condition[0];

            // check which keys are in this condition:
            const conditionKeys = Object.keys(condition);
            if (conditionKeys.indexOf('@value') > -1) {
              return condition['@value'];
            }

            if (conditionKeys.indexOf('http://schema.org/httpMethod') > -1 &&
              conditionKeys.indexOf('http://schema.org/url') > -1 &&
              conditionKeys.indexOf('https://schema.repronim.org/payload') > -1
            ) {
              // lets fill the payload here.
              const payload = {};
              const payloadList = condition['https://schema.repronim.org/payload'];
              _.map(payloadList, (p) => {
                const item = p['@value'];
                const index = this.schemaNameMapper[item]['@id'];
                payload[this.schemaNameMapper[item]['@id']] = this.responses[index];
              });
              return {
                url: condition['http://schema.org/url'][0]['@value'],
                method: condition['http://schema.org/httpMethod'][0]['@value'],
                payload,
              };
            }
          }
          // if something is up with the schema, just default to true.
          return true;
        });
      }
      // return all true's:
      return _.mapValues(this.activityOrder, () => true);
    },
  },
  watch: {
    visibilityConditions: {
      handler(newC) {
        if (!_.isEmpty(newC)) {
          this.setVisbility();
        }
      },
      deep: true,
    },
  },
  methods: {
    getAppletData() {
      jsonld.expand(this.appletUrl).then((resp) => {
        this.data = resp[0];
        this.initializeStorage();
        this.$forceUpdate();
      });
    },
    initializeStorage() {
      _.map(this.activityOrder, (a) => {
        const id = a['@id'];
        this.$set(this.responses, id, {});
        this.$set(this.progress, id, 0);
        this.$set(this.complete, id, false);
      });
    },
    checkProgressDiff(oldP, newP) {
      // TODO: check for an already completed activity. Progress won't change,
      // but there will be a change in responses that needs to trigger
      // this.setVisibility().
      if ((oldP !== newP) && newP === 100) {
        // console.log('time to check for branching activities!');
        this.setVisbility();
      }
    },
    saveResponse(activity, responseId, response) {
      let needsVizUpdate = false;
      if (this.responses[activity][responseId] !== response && this.progress[activity] === 100) {
        // there has been a change in an already completed activity
        needsVizUpdate = true;
      }
      this.responses[activity][responseId] = response;
      // this.$set(this.responses, activity, response);
      if (needsVizUpdate) {
        this.setVisbility();
      }
    },
    saveProgress(activity, progress) {
      this.checkProgressDiff(this.progress[activity], progress);
      // this.progress[activity] = progress;
      this.$set(this.progress, activity, progress);
    },
    saveComplete(activity, complete) {
      this.complete[activity] = complete;
      // this.$set(this.complete, activity, complete);
    },
    getName(url) {
      // TODO: this is a hack. the jsonld expander should give us this info.
      if (url) {
        const nameMap = this.data['https://schema.repronim.org/activity_display_name'][0];
        if (url in nameMap) {
          // console.log(123, nameMap[url][0]['@id']);
          const mappedUrl = nameMap[url][0]['@id'];
          const folders = mappedUrl.split('/');
          const N = folders.length;
          return folders[N - 1].split('_schema')[0].split('.jsonld')[0];
        }
      }
      return null;
    },
    async computeVisibilityCondition(cond, index) {
      if (_.isObject(cond)) {
        const request = {
          method: cond.method,
          url: cond.url,
          data: cond.payload,
          headers: {
            'content-type': 'application/json',
          },
        };
        const cacheKey = JSON.stringify(request);
        if (Object.keys(this.cache).indexOf(cacheKey) > -1) {
          // this.visibility[index] = this.cache[cacheKey];
          return this.cache[cacheKey];
        }
        if (this.visibility[index] == null || this.visibility[index] === undefined) {
          // if there is a request and it hasn't been run yet, then
          // default to false
          this.visibility[index] = false;
        }
        const resp = await axios(request);

        // this.visibility[index] = resp.data;
        this.cache[cacheKey] = resp.data;

        return resp.data;
      } else if (_.isString(cond)) {
        // todo: implement client-side evaluation!
        Error('Client-side branching at activity set level is not implemented yet');
      }
      // this.visibility[index] = cond;
      return cond;
    },
    visibilityChain(conditionList) {
      if (!conditionList[0]) {
        return 0;
      }
      return this.computeVisibilityCondition(conditionList[0].condition,
        conditionList[0].index)
        .then((resp) => {
          this.visibility[conditionList[0].index] = resp;
          this.$forceUpdate();
          const newConditionList = [...conditionList];
          newConditionList.shift();
          this.visibilityChain(newConditionList);
        });
    },
    setVisbility() {
      const values = _.map(this.visibilityConditions, (condition, index) => ({ condition, index }));
      this.visibilityChain(values);
    },
  },
};
</script>

