<template>
  <div>
    <b-container>
      <Login :apiHost="apiHost" v-on:login="saveUser" v-if="!user.authToken"/>
      <br>
      <div v-if="user.authToken">
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
  </div>
</template>

<script>
import Survey from '@bit/akeshavan.mindlogger-web.survey';
import Login from './Login/Login';
import api from '../lib/api/api';

export default {
  name: 'HelloWorld',
  components: {
    Login,
    Survey,
  },
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      apiHost: 'https://mindlogger-dev.vasegurt.com/api/v1',
      responses: {},
      srcUrl: 'https://raw.githubusercontent.com/ReproNim/schema-standardization/master/activities/PHQ-9/phq9_schema.jsonld',
      progress: 0,
      user: {},
    };
  },
  methods: {
    saveUser(u) {
      this.user = u;
    },
    saveResponse(resp, val) {
      this.responses[resp] = val;
    },
    updateProgress(p) {
      this.progress = p;
    },
    clearResponses() {

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
