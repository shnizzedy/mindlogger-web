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
      <h1 class="mb-3 pb-3">{{user.user.firstName}}'s Studies</h1>
      <div v-if="query.inviteURL">
        <b-alert show>
          <p>you have an invite to a new applet!</p>
          <b-button v-b-modal.appletConsent>Add this applet</b-button>
        </b-alert>
      </div>
      <div v-if="status==='ready'" class="mb-3 pb-3">
        <div v-if="!appletsFromServer.length">
          <p class="lead">
            You have no apps yet!
          </p>
          <img src="@/assets/undraw_no_data_qbuo.svg" class="illustration" />
        </div>
        <div
         v-for="(applet, index) in appletsFromServer"
         :key="applet['http://schema.org/url'][0]['@value']" class="mt-3 mb-3"
        >
          <!-- <b-card :img-src="`https://picsum.photos/200/200/?image=${index+350}`"
           img-alt="Card image"
           img-left class="text-left"
           >
            <h3 class="card-title">
            <router-link :to="{name: 'Applet', params: {appletId: applet.url}}">
              <span v-if="appletData[applet.url] != undefined">
                {{appletData[applet.url]['http://www.w3.org/2004/02/skos/core#prefLabel'][0]['@value']}}
              </span>
            </router-link>
            </h3>
            <p>
              {{appletData[applet.url]['http://schema.org/description'][0]['@value']}}
            </p>
          </b-card> -->

          <b-card no-body class="overflow-hidden mx-auto special" style="max-width: 540px;">
            <router-link :to="{name: 'Applet', params: {appletId: applet['http://schema.org/url'][0]['@value']}}">
            <b-row no-gutters>
              <b-col md="6">
                <b-card-img
                :src="appletData[applet['http://schema.org/url'][0]['@value']]['http://schema.org/image'] ? appletData[applet['http://schema.org/url'][0]['@value']]['http://schema.org/image'][0]['@value'] : `https://picsum.photos/400/400/?image=${350 + index}`"
                class="rounded-0 pt-3 pb-3 pl-3 pr-3"
                style="width: 250px; height: 250px;"
                />
              </b-col>
              <b-col md="6" v-if="appletData[applet['http://schema.org/url'][0]['@value']]">
                <b-card-body :title="appletData[applet['http://schema.org/url'][0]['@value']]['http://www.w3.org/2004/02/skos/core#prefLabel'][0]['@value']">
                  <b-card-text>
                    {{appletData[applet['http://schema.org/url'][0]['@value']]['http://schema.org/description'][0]['@value']}}
                  </b-card-text>
                </b-card-body>
              </b-col>
            </b-row>
            </router-link>
          </b-card>

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
import jsonld from 'jsonld/dist/jsonld.min';
// import Loader from '@bit/akeshavan.mindlogger-web.loader';
import _ from 'lodash';
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
      appletsFromServer: {},
      appletData: {},
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
  },
  watch: {
    isLoggedIn() {
      if (this.isLoggedIn) {
        this.getApplets();
        this.getAppletData();
      }
    },
    // TODO: replace this watch for the appletsFromServer
    /**
     * we want to load applet data (e.g. nice applet name description, etc)
     */
    applets() {
      this.getAppletData();
    },
  },
  methods: {
    getApplets() {
      this.status = 'loading';
      api.getAppletsForUser({
        apiHost: this.apiHost,
        token: this.user.authToken.token,
        user: this.user.user._id,
        role: 'user',
      })
        .then((resp) => {
          this.appletsFromServer = resp.data.map(applet => applet.applet)
            .filter(a => a['http://schema.org/url']);
          this.status = 'ready';
        })
        .catch((e) => {
          this.error = e;
          this.status = 'error';
        });
    },
    getAppletData() {
      this.dataStatus = 0;
      _.map(this.applets, (a) => {
        jsonld.expand(a.url).then((resp) => {
          this.appletData[a.url] = resp[0];
          this.$forceUpdate();
          this.dataStatus += 1;
        });
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
      this.getAppletData();
    }
  },
};
</script>
