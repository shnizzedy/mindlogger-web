<template>
  <div id="app">
    <Navbar :user="user.user" :isLoggedIn="isLoggedIn" :logout="logout"/>
    <router-view
      v-on:login="saveUser"
      :apiHost="config.apiHost"
      :srcUrl="config.srcUrl"
      :user="user"
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
  },
  components: {
    Navbar,
  },
  methods: {
    saveUser(u) {
      this.user = u;
      this.$router.push('/');
    },
    logout() {
      this.user = {};
      this.$router.push('/login');
    },
  },
};
</script>

<style lang="scss">
  @import './custom-bootstrap.scss';
  @import '../node_modules/bootstrap/scss/bootstrap.scss';
</style>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
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
