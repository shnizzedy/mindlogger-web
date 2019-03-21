<template>
  <div>
    <b-row>
      <nav-side>
        <b-col>
        <div class="ml-3 mr-3 mt-3 text-left">

          <p>
            <router-link exact :to="{name: 'Applet', params: {appletId: appletUrl}}">
              About
            </router-link>
          </p>

          <p v-for="(act, index) in activityOrder" :key="index">
            <router-link
             :to="{name: 'TakeSurvey', params: {appletId: appletUrl, surveyId: act['@id']}}">
              <circle-progress
                :radius="20"
                :progress="progress[act['@id']]"
                :stroke="4"
                strokeColor="#007bff" />
              {{act['@id'].split('/')[8].split('.jsonld')[0]}}
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
<style>
  /* @import '../custom-bootstrap.scss';
  // @import '../../node_modules/bootstrap/scss/bootstrap.scss'; */

  .right-side {
    overflow-y: auto;
  }

  .router-link-active {
    color: green;
  }
</style>

<script>
import jsonld from 'jsonld/dist/jsonld.min';
import Circle from '@bit/akeshavan.mindlogger-web.circle';
import _ from 'lodash';
import NavSide from './NavSide';

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
    saveResponse(activity, responseId, response) {
      this.responses[activity][responseId] = response;
      // this.$set(this.responses, activity, response);
    },
    saveProgress(activity, progress) {
      this.progress[activity] = progress;
      // this.$set(this.progress, activity, progress);
    },
    saveComplete(activity, complete) {
      this.complete[activity] = complete;
      // this.$set(this.complete, activity, complete);
    },
  },
};
</script>

