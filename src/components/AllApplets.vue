<template>
  <div class="container mt-3">
    <div v-if="!isLoggedIn">
      <h1>Oops!</h1>
      <p class="lead">
        Please log in or sign up to see this page:
      </p>
      <b-button :to="{name: 'Login', query}" variant="primary" size="lg">Log In</b-button>
      or
      <b-button :to="{name: 'SignUp', query}" variant="success" size="lg">Sign Up</b-button>
    </div>
    <div v-else class="mt-3 pt-3">
      <b-modal id="appletConsent" size="lg"
       ok-title="I consent" v-on:ok="addAppletToUser(query.inviteURL)">
        applet consent form.
      </b-modal>
      <div class="text-right text-muted" v-if="status==='loading' && appletsFromServer.length">
        <small>refreshing
        <i class="fas fa-sync fa-spin ml-1"></i></small>
      </div>
      <h1 class="mb-3 pb-3">{{user.user.firstName}}'s Studies</h1>
      <div v-if="query.inviteURL">
        <b-alert show>
          <p>you have an invite to a new applet!</p>
          <b-button v-b-modal.appletConsent>Add this applet</b-button>
        </b-alert>
      </div>
      <div v-if="status==='ready' || appletsFromServer.length" class="mb-3 pb-3">
        <div v-if="!appletsFromServer.length && status==='ready'">
          <p class="lead">
            You have no applets yet!
          </p>
          <img src="@/assets/undraw_no_data_qbuo.svg" class="illustration" />
        </div>
        <div v-else>
          <div
            v-for="(applet, index) in appletsFromServer"
            :key="applet['schema:url']" class="mt-3 mb-3"
          >
            <b-card no-body class="overflow-hidden mx-auto special" style="max-width: 540px;">
              <router-link :to="{name: 'Applet', params: {appletId: applet['schema:url']}}">
              <b-row no-gutters>
                <b-col md="6">
                  <b-card-img
                  :src="applet['schema:image'] ? applet['schema:image'] : `https://picsum.photos/400/400/?image=${350 + index}`"
                  class="rounded-0 pt-3 pb-3 pl-3 pr-3"
                  style="width: 250px; height: 250px;"
                  />
                </b-col>
                <b-col md="6" v-if="applet['schema:url']">
                  <b-card-body :title="applet['http://www.w3.org/2004/02/skos/core#prefLabel'][0]['@value']">
                    <b-card-text>
                      {{applet['schema:description'][0]['@value']}}
                    </b-card-text>
                  </b-card-body>
                </b-col>
              </b-row>
              </router-link>
            </b-card>
          </div>
        </div>
      </div>
      <BounceLoader v-else-if="status==='loading'" class="top80"/>
      <div v-else-if="status==='error'">
        <b-alert show variant="danger">
          <p><b>Oh no!</b> {{error}}</p>
          <p class="mb-0">
            Please file an <a href="https://github.com/ChildMindInstitute/mindlogger-web">
            issue on GitHub</a> so we can fix this problem!
          </p>
          <p>
            {{user.user._id}}
          </p>
        </b-alert>
      </div>
    </div>
  </div>
</template>

<style>
  .special {
    cursor: pointer;
    transition: all .2s ease-in-out;
  }

  .special:hover {
    transform: scale(1.05)
  }

  .top80 {
    top: 80px;
  }

  .illustration {
    max-width: 250px;
    width: 100%;
  }
</style>

<script>
// import jsonld from 'jsonld/dist/jsonld.min';
// import Loader from '@bit/akeshavan.mindlogger-web.loader';
// import _ from 'lodash';
import api from '../lib/api/';
import BounceLoader from './BounceLoader';

export default {
  name: 'AllApplets',
  props: {
    isLoggedIn: {
      type: Boolean,
    },
    user: {
      type: Object,
    },
    activities: {
      type: Object,
    },
    applets: {
      type: Array,
    },
    apiHost: {
      type: String,
    },
    query: {
      type: Object,
    },
  },
  components: {
    BounceLoader,
  },
  data() {
    return {
      // appletsFromServer: {},
      // appletData: {},
      dataStatus: 0,
      status: 'loading',
    };
  },
  computed: {
    // status() {
    //   if (Object.keys(this.appletData).length === this.dataStatus) {
    //     return 'ready';
    //   }
    //   return 'loading';
    // },
    appletsFromServer() {
      return this.$store.state.applets;
    },
  },
  watch: {
    isLoggedIn() {
      if (this.isLoggedIn) {
        this.getApplets();
      }
    },
  },
  methods: {
    getApplets() {
      this.status = 'loading';
      return api.getAppletsForUser({
        apiHost: this.apiHost,
        token: this.user.authToken.token,
        user: this.user.user._id,
        role: 'user',
      })
        .then((resp) => {
          if (resp.data.length) {
            const appletsFromServer = resp.data.map(applet => applet.applet)
              .filter(a => a['_id']);
            const activitiesFromServer = Object.assign(...resp.data.map(
              activity => activity.activities,
            ));
            this.$store.commit('setApplets', appletsFromServer);
            this.$store.commit('setActivities', activitiesFromServer);
          }
          this.status = 'ready';
        })
        .catch((e) => {
          this.error = e;
          this.status = 'error';
        });
    },
    addAppletToUser(appletId) {
      api.addAppletToUser({ apiHost: this.apiHost, appletId, token: this.user.authToken.token })
        // eslint-disable-next-line
        .then((resp) => {
          // console.log('added a new applet', resp);
        })
        .then(this.getApplets);
    },
  },
  mounted() {
    if (this.isLoggedIn) {
      this.getApplets();
    }
  },
};
</script>
