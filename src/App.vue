<template>
  <div id="app">
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
// import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import config from './config';

Vue.use(BootstrapVue);


export default {
  name: 'App',
  data() {
    return {
      user: {},
      config,
    };
  },
  methods: {
    saveUser(u) {
      this.user = u;
      this.$router.push('/');
    },
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
