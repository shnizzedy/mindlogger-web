<template>
  <div class="takeSurvey">
    <b-container v-if="user.authToken">
      <div>
        <div>hi {{user.user.firstName}}</div>
        <b-button @click="sendData">Save</b-button>
      </div>
      <br>
      <Survey
        :srcUrl="srcUrl"
        :progress="progress"
        selected_language="en"
        :responses="responses"
        v-on:updateProgress="updateProgress"
        v-on:saveResponse="saveResponse"
        v-on:clearResponses="clearResponses"
      />
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
import Login from './Login/';
import api from '../lib/api/api';

export default {
  name: 'TakeSurvey',
  components: {
    Login,
    Survey,
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
      api.sendActivityData({ data: this.responses,
        apiHost: this.apiHost,
        token: this.authToken,
      }).then((resp) => {
        console.log('server response', resp);
      }).catch((err) => {
        console.log(err);
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

h1, h2 {
  font-weight: normal;
}
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
