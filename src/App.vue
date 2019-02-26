<template>
  <div id="app">
    <Navbar :user="user.user" :isLoggedIn="isLoggedIn" :logout="logout" :query="query"/>
    <router-view
      v-on:login="saveUser"
      :isLoggedIn="isLoggedIn"
      :apiHost="config.apiHost"
      :applets="config.applets"
      :user="user"
      :query="query"
    />
  </div>
</template>

<script>
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import config from './config';
import Navbar from './components/Navbar/';

Vue.use(BootstrapVue);

const localStorage = require('localStorage');

export default {
  name: 'App',
  data() {
    return {
      user: {},
      config,
    };
  },
  computed: {
    isLoggedIn() {
      return !_.isEmpty(this.user);
    },
    query() {
      return this.$route.query;
    },
  },
  mounted() {
    try {
      this.user = JSON.parse(localStorage.getItem('user')) || {};
    } catch (error) {
      this.user = {};
    }
  },
  components: {
    Navbar,
  },
  methods: {
    saveUser(u) {
      this.user = u;
      this.saveToken(u);
      this.$router.push({ name: 'AllApplets', query: this.query });
    },
    logout() {
      this.user = {};
      this.$router.push('/login');
      localStorage.setItem('user', {});
    },
    /**
     * save the authtoken to localstorage
     */
    saveToken(user) {
      localStorage.setItem('user', JSON.stringify(user));
    },
  },
};
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css?family=IBM+Plex+Sans:300,400');
  @import './custom-bootstrap.scss';
  @import '../node_modules/bootstrap/scss/bootstrap.scss';
</style>

<style>
#app {
  font-family: 'IBM Plex Sans', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#login {
  margin-top: 60px;
}

#signup {
  margin-top: 60px;
}
</style>
