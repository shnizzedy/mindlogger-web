<template>
  <div class="takeSurvey">
    <b-container v-if="user.authToken">
      <br>
      <Survey
        :srcUrl="srcUrl"
        :progress="progress"
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
            Thanks {{user.user.firstName}}!
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
    srcUrl: {
      type: String,
    },
  },
  data() {
    return {
      responses: {},
      progress: 0,
      saveReady: true,
      complete: false,
    };
  },
  methods: {
    saveResponse(resp, val) {
      this.responses[resp] = val;
    },
    updateProgress(p) {
      this.progress = p;
    },
    clearResponses() {
      this.responses = {};
    },
    sendData() {
      this.saveReady = false;
      api.sendActivityData({
        data: {
          applet: 'nda_phq_schema',
          activity: 'phq9_schema',
          responses: this.responses,
        },
        apiHost: this.apiHost,
        token: this.user.authToken.token,
      }).then((resp) => {
        console.log('server response', resp);
        this.saveReady = true;
        this.complete = true;
      }).catch(() => {
        // console.log(err);
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.takeSurvey {
  margin-top: 60px;
}

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
a {
  color: #42b983;
}
</style>
