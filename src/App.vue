<template>
  <div id="app" v-bind:style="skinStyles.skinColor">
    <Navbar :user="user.user" :isLoggedIn="isLoggedIn" :logout="logout" :query="query" :skin="skin" :skinStyles="skinStyles">
      <b-nav-item v-if="isLoggedIn" :to="{name: 'AllApplets', query}">Home</b-nav-item>
    </Navbar>
    <div class="demo mb-3">
      <router-view
        v-on:login="saveUser"
        :isLoggedIn="isLoggedIn"
        :apiHost="config.apiHost"
        :applets="config.applets"
        :user="user"
        :query="query"
        :skin="skin"
      />
    </div>
    <!-- The footer -->

    <footer class="bg-light pt-3 pb-3 mt-3 footer">
      <b-row>
        <b-col class="text-center">
          <p class="mt-3">
          <!-- TODO: unhardcode this logo and text! -->
          <img class="logo" v-bind:style="skinStyles.backgroundSkinColor"
          src="https://27c2s3mdcxk2qzutg1z8oa91-wpengine.netdna-ssl.com/wp-content/themes/childmind/assets/img/cmi-logo-vert-ko.svg" />
          © <a href="https://childmind.org">Child Mind Institute</a> MATTER Lab 2019</p>
        </b-col>
      </b-row>
      <div class="extra"></div>
    </footer>
  </div>
</template>

<script>
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import api from './lib/api/';
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
      skinStyles: {
        backgroundSkinColor: {
          background: this.$store.state.skin.colors.primary,
          color: this.$store.state.skin.colors.secondary
        },
        skinColor: {
          color: this.$store.state.skin.colors.primary,
          background: this.$store.state.skin.colors.secondary
        }
      }
    };
  },
  computed: {
    isLoggedIn() {
      return !_.isEmpty(this.user);
    },
    query() {
      return this.$route.query;
    },
    skin() {
      return this.$store.state.skin;
    }
  },
  mounted() {
    try {
      this.user = JSON.parse(localStorage.getItem('user')) || {};
    } catch (error) {
      this.user = {};
    }
    this.getSkin();
  },
  components: {
    Navbar,
  },
  methods: {
    getSkin() {
      this.status = 'loading';
      return api.getSkin({
        apiHost: this.config.apiHost,
        token: this.user.authToken.token || null
      })
      .then((resp) => {
        this.status = 'ready';
        this.$store.commit('setSkin', resp.data);
      })
      .catch((e) => {
        this.error = e;
        this.status = 'error';
      });
    },
    saveUser(u) {
      this.user = u;
      this.saveToken(u);
    },
    logout() {
      this.user = {};
      this.$router.push('/login');
      localStorage.setItem('user', {});
      this.$store.commit('reinitializeState');
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

   .logo {
    background: $dark-blue;
    border-style: solid;
    border-radius: 25px;
    border-width: 0px;
    padding: 10px;
    height: 40px;
  }
</style>

<style>
#app {
  font-family: 'IBM Plex Sans', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

a:hover {
    text-decoration: none !important;
}

#login {
  margin-top: 60px;
}

#signup {
  margin-top: 60px;
}

.footer {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 1rem;
  text-align: center;
}

html {
  height: 100%;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

html
  {
      width:100%;
      height: 100%;
      margin: 0px;
      padding: 0px;
      overflow-x:hidden;
  }

body {
  position: relative;
  margin: 0;
  padding-bottom: 10rem;
  min-height: 100%;
  overflow-x:hidden;
}

.demo {
  margin: 0 auto;
  /* padding-top: 64px;
  max-width: 640px;
  width: 94%; */
}
</style>
