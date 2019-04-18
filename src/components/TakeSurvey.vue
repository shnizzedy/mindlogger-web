<template>
  <div class="takeSurvey">
    <b-container v-if="user.authToken">
      <br>
      <Survey
        :srcUrl="srcUrl"
        :progress="progress"
        ref="surveyComponent"
        selected_language="en"
        :responses="responses"
        v-on:updateProgress="updateProgress"
        v-on:saveResponse="saveResponse"
        v-on:clearResponses="clearResponses"
      >
        <div class="mb-3">
          <div v-if="!complete">
            <div class="mb-3">Please review your responses, then click "Save" below:</div>
            <save-button variant="success" label="save" :ready="saveReady" :click="sendData"/>
          </div>
          <div v-else>
            <div class="mt-3 mb-3">
              <p class="lead"> Thanks {{user.user.firstName}}! </p>
            </div>
            <b-button v-if="nextActivity[srcUrl]" size="lg" variant="info"
              :to="{name: 'TakeSurvey', params: {surveyId: nextActivity[srcUrl]}}">
              Next
            </b-button>
            <b-button v-else size="lg" variant="secondary"
              :to="{name: 'Applet'}">
              Back to my Activities
            </b-button>
          </div>
        </div>
      </Survey>
    </b-container>
    <b-container v-else>
      Please <router-link to="/login">log in</router-link>
      or <router-link to="/signup">sign up</router-link>
      to take this survey!
    </b-container>
  </div>
</template>

<script>
import Survey from '@bit/akeshavan.mindlogger-web.survey';
import SaveButton from './SaveButton';
import Login from './Login/';
import api from '../lib/api/api';

export default {
  name: 'TakeSurvey',
  components: {
    Login,
    Survey,
    SaveButton,
  },
  props: {
    user: {
      type: Object,
    },
    apiHost: {
      type: String,
    },
    applet: {
      type: Object,
    },
    progressObj: {
      type: Object,
    },
    responsesObj: {
      type: Object,
    },
    completeObj: {
      type: Object,
    },
    nextActivity: {
      type: Object,
    },
  },
  data() {
    return {
      // responses: {},
      // progress: 0,
      saveReady: true,
      // complete: false,
    };
  },
  computed: {
    srcUrl() {
      return this.$route.params.surveyId;
    },
    progress() {
      return this.progressObj[this.srcUrl] || 0;
    },
    responses() {
      return this.responsesObj[this.srcUrl] || {};
    },
    complete() {
      return this.completeObj[this.srcUrl] || false;
    },
  },
  methods: {
    saveResponse(resp, val) {
      // this.responses[resp] = val;
      this.$emit('saveComplete', this.srcUrl, false);
      this.$emit('saveResponse', this.srcUrl, resp, val);
      // this.$emit('saveProgress', this.srcUrl, this.progress);
    },
    updateProgress(p) {
      // this.progress = p;
      this.$emit('saveProgress', this.srcUrl, p);
    },
    clearResponses() {
      // this.responses = {};
    },
    sendData() {
      this.saveReady = false;
      // console.log('responses', this.responses);

      // restructure responses if they are nested?

      api.getAppletFromURI({
        apiHost: this.apiHost,
        token: this.user.authToken.token,
        URI: this.applet.url,
      })
        .then((appletResp) => {
          api.getActivityFromURI({
            apiHost: this.apiHost,
            token: this.user.authToken.token,
            URI: this.srcUrl,
          })
            .then((activityResp) => {
              api.sendActivityData({
                data: {
                  applet: appletResp.data._id,
                  activity: activityResp.data._id,
                  responses: this.responses,
                },
                apiHost: this.apiHost,
                token: this.user.authToken.token,
              }).then(() => {
                this.saveReady = true;
                // this.complete = true;
                this.$emit('saveComplete', this.srcUrl, true);
              }).catch(() => {
                // console.log(err);
              });
            });
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* .takeSurvey {
  margin-top: 60px;
} */

/* h1, h2 {
  font-weight: normal;
} */
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
/* a {
  color: #42b983;
} */
</style>
