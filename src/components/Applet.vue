<template>
  <div class="mt-3 container">
    <div v-if="!isLoggedIn">
      You're not logged in!
    </div>
    <div v-else>
      <div>
        <h1>{{applet.name}}</h1>
      </div>
      <p>

        There should be Applet-specific text here.
        Ideally rendered from a markdown file, the link to which
        is in the applet JSONLD.

      </p>

      <p>
        <b-button size="lg" variant="success" v-if="activityOrder[0]"
         :to="{name: 'TakeSurvey', params: {appletId: applet.url, surveyId: activityOrder[0]['@id']}}">
          Start
        </b-button>
      </p>
      <!-- <div v-for="(activity, index) in activityOrder"
        :key="activity['@id']"
        class="text-left mt-3 mb-3">
        <span>{{index+1}}.</span>
        <span>
          <b>progress:</b>
          {{progressObj[activity['@id']]}}
        </span>
        <span>
          <b>complete:</b>
          {{completeObj[activity['@id']]}}
        </span>
        <router-link :to="{name: 'TakeSurvey', params: {surveyId: activity['@id']}}">
          {{activity['@id']}}
        </router-link>
      </div> -->
    </div>
  </div>
</template>

<script>

export default {
  name: 'Applet',
  props: {
    applet: {
      type: Object,
    },
    user: {
      type: Object,
    },
    isLoggedIn: {
      type: Boolean,
    },
    progressObj: {
      type: Object,
    },
    completeObj: {
      type: Object,
    },
    data: {
      type: Object,
    },
    activityOrder: {
      type: Array,
    },
    activityDisplayNames: {
      type: Object,
    },
  },
  data() {
    return {

    };
  },
  mounted() {
    // this.getAppletData();
  },
  computed: {
    // activityOrder() {
    //   const tmp = this.data['https://schema.repronim.org/order'];
    //   if (tmp) {
    //     return tmp[0]['@list'];
    //   }
    //   return [];
    // },
  },
  methods: {
    // getAppletData() {
    //   jsonld.expand(this.applet.url).then((resp) => {
    //     this.data = resp[0];
    //   });
    // },
  },
};
</script>

