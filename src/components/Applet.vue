<template>
  <div class="mt-3 container">
    <div v-if="!isLoggedIn">
      You're not logged in!
    </div>
    <div v-else>
      <div class="mb-3 pb-3 mt-3 pt-3 text-left markdown container" v-if="about">
        <vue-markdown :watches="['source']">{{about}}</vue-markdown>
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
      </div>

      <p>
        <b-button size="lg" variant="success" v-if="activityOrder[0]"
         :to="{name: 'TakeSurvey',
         params: {appletId: applet._id, surveyId: activityOrder[0]['@id']}}">
          Start
        </b-button>
      </p>
      <div v-for="(activity, index) in activityOrder"
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
      </div>
    </div>
  </div>
</template>

<style>
.markdown h1 {
    text-align: center;
}

.markdown img {
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: auto;
  margin-right: auto;
  display: block;
}
</style>


<script>
import VueMarkdown from 'vue-markdown';
import axios from 'axios';

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
      about: '',
    };
  },
  components: {
    VueMarkdown,
  },
  watch: {
    data() {
      this.getAboutData();
    },
  },
  mounted() {
    // this.getAppletData();
    this.getAboutData();
    window.scrollTo(0, 0);
  },
  computed: {
    // activityOrder() {
    //   const tmp = this.data['reprolib:terms/order'];
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
    getAboutData() {
      if (this.data['schema:about']) {
        axios.get(this.data['schema:about'][0]['@value']).then((resp) => {
          this.about = resp.data;
        });
      }
    },
  },
};
</script>
