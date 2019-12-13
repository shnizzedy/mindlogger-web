<template>
  <div>
    <b-row class="tall">
      <nav-side>
        <b-col>
          <div class="ml-3 mr-3 mt-3 text-left">
            <p>
              <router-link exact :to="{name: 'Applet', params: {appletId: appletId}}" class="link">
                About
              </router-link>
            </p>
            <p>
              <router-link exact :to="{name: 'AppletDashboard', params: {appletId: appletId}}"
                class="link">
                Data
              </router-link>
            </p>
            <p v-for="(act, index) in activityOrder" :key="index">
              <router-link
              :to="{name: 'TakeSurvey', params: {
                  appletId: appletId,
                  applet: applet,
                  activityId: activities[act['@id']]._id.split('/')[1],
                  srcUrl: act['@id'],
                  activities,
                  items}
                }"
              class="link"
              v-if="visibility[index]"
              >
                <circle-progress
                  style="display: inline;"
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
      <!-- only show this if we're on a small screen -->
      <nav-bottom>
        <span class="ml-3 mr-3 mt-2 mb-3">
          <router-link exact :to="{name: 'Applet', params: {appletId: appletId}}" class="link">
             <div><i class="fas fa-info mb-2"></i></div>
            About
          </router-link>
        </span>
        <span class="ml-3 mr-3 mt-2 mb-3">
          <router-link exact :to="{name: 'AppletDashboard', params: {appletId: appletId}}"
            class="link">
            <div><i class="fas fa-chart-line mb-2"></i></div>
            Data
          </router-link>
        </span>
        <span class="ml-3 mr-3 mt-2 mb-3 bottomNav"
          v-for="(act, index) in activityOrder" :key="index">
              <router-link
              :to="{name: 'TakeSurvey', params: {
                  appletId: appletId,
                  applet: applet,
                  activityId: activities[act['@id']]._id.split('/')[1],
                  srcUrl: act['@id'],
                  activities,
                  items}
                }"
              class="link"
              v-if="visibility[index]"
              >
                <circle-progress
                  :radius="14"
                  :progress="progress[act['@id']]"
                  :stroke="3"
                  :strokeColor="complete[act['@id']] ? colors.success : colors.primary" />
                {{getName(act['@id'])}}
              </router-link>
        </span>
      </nav-bottom>
      <b-col>
      <div class="right-side ml-1 mr-1">
      <router-view
        :user="user"
        :data="data"
        :activities="activities"
        :activityOrder="activityOrder"
        :activityDisplayNames="activityDisplayNames"
        :items="items"
        :appletId="appletId"
        :isLoggedIn="isLoggedIn"
        :applet="applet"
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

  .tall {
    min-height: 100VH;
  }

  .right-side {
    overflow-y: auto;
    height: 100%;
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

  .bottomNav svg {
    margin-left: auto;
    margin-right: auto;
  }

  .bottomNav {
    text-overflow: ellipsis;
    width: 75px;
    min-width: 70px;
    white-space: nowrap;
    overflow: hidden;
  }

  .extra {
  height: 75px;
}

@media only screen and (min-width: 1025px) {
  .extra {
    height: 0;
  }
}

</style>

<script>
import axios from 'axios';
import _ from 'lodash';
import '@fortawesome/fontawesome-free/css/all.css';
import Circle from './Circle';
import NavSide from './NavSide';
import NavBottom from './NavBottom';
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
    const uri = v['reprolib:terms/isAbout'][0]['@id'];
    const variable = v['reprolib:terms/variableName'][0]['@value'];
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
    user: {
      type: Object,
    },
    apiHost: {
      type: String,
    },
  },
  components: {
    NavSide,
    NavBottom,
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
      // cache: {},
    };
  },
  mounted() {
  },
  computed: {
    applet() {
      return this.applets.filter(a => a._id === `applet/${this.appletId}`)[0];
    },
    applets() {
      return this.$store.state.applets;
    },
    appletId() {
      return this.$route.params.appletId;
    },
    activityOrder() {
      if (this.applet) {
        const tmp = this.applet['reprolib:terms/order'];
        if (tmp) {
          return tmp[0]['@list'];
        }
      }
      return [];
    },
    activityDisplayNames() {
      if (this.data) {
        const tmp = this.data['reprolib:terms/activity_display_name'];
        if (tmp) {
          return tmp[0];
        }
      }
      return {};
    },
    activities() {
      return this.$store.state.activities;
    },
    items() {
      return this.$store.state.items;
    },
    cache() {
      return this.$store.state.branchingCache;
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
          if (this.data['reprolib:terms/variableMap']) {
            fname = getVariableName(s, this.data['reprolib:terms/variableMap']);
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
      if (this.data['reprolib:terms/visibility']) {
        return _.map(this.activityOrder, (s) => {
          // console.log(s);
          // TODO: don't assume the key name is the same as the ending of the filename.
          let keyName = '';
          if (this.data['reprolib:terms/variableMap']) {
            keyName = getVariableName(s, this.data['reprolib:terms/variableMap']);
          } else {
            // TODO: remove this backwards compatibility else
            keyName = getFilename(s);
          }

          // look through the "reprolib:terms/visibility" field
          // and reformat nicely

          let condition = _.filter(this.data['reprolib:terms/visibility'], c => c['@index'] === keyName);

          if (condition.length === 1) {
            condition = condition[0];

            // check which keys are in this condition:
            const conditionKeys = Object.keys(condition);
            if (conditionKeys.indexOf('@value') > -1) {
              return condition['@value'];
            }

            if (conditionKeys.indexOf('schema:httpMethod') > -1 &&
              conditionKeys.indexOf('schema:url') > -1 &&
              conditionKeys.indexOf('reprolib:terms/payload') > -1
            ) {
              // lets fill the payload here.
              const payload = {};
              const payloadList = condition['reprolib:terms/payload'];
              _.map(payloadList, (p) => {
                const item = p['@value'];
                const index = this.schemaNameMapper[item]['@id'];
                payload[this.schemaNameMapper[item]['@id']] = this.responses[index];
              });
              return {
                url: condition['schema:url'],
                method: condition['schema:httpMethod'][0]['@value'],
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
      if (this.progress[activity] === 100) {
        // there has been a change in an already completed activity
        needsVizUpdate = true;
      }
      // this.responses[activity][responseId] = response;
      this.$set(this.responses, activity, response);
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
      if (url) {
        if (url in this.activities) {
          return (this.activities[url]['http://www.w3.org/2004/02/skos/core#prefLabel'][0]['@value'] || this.activities[url]['http://www.w3.org/2004/02/skos/core#altLabel'][0]['@value'] || undefined);
        }
        const nameMap = this.data['reprolib:terms/activity_display_name'][0];
        if (url in nameMap) {
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
        // this.cache[cacheKey] = resp.data;
        this.$store.commit('setBranchingCache', { key: cacheKey, data: resp.data });
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
