<template>
  <div>
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
</template>

<script>
import jsonld from 'jsonld/dist/jsonld.min';
import _ from 'lodash';

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
      const tmp = this.data['https://schema.repronim.org/order'];
      if (tmp) {
        return tmp[0]['@list'];
      }
      return [];
    },
    activityDisplayNames() {
      const tmp = this.data['https://schema.repronim.org/activity_display_name'];
      if (tmp) {
        return tmp[0];
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

