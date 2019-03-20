<template>
  <div class="container mt-3">
    <div v-if="!isLoggedIn">
      You're not logged in!
    </div>
    <div v-else>
      <b-modal id="appletConsent" ok-title="I consent" v-on:ok="addAppletToUser(query.inviteURL)">
        applet consent form.
      </b-modal>
      <h1>{{user.user.firstName}}'s Applets</h1>
      <div v-if="query.inviteURL">
        <b-alert show>
          <p>you have an invite to a new applet!</p>
          <b-button v-b-modal.appletConsent>Add this applet</b-button>
        </b-alert>
      </div>
      <div>
        <div v-for="(applet, index) in applets" :key="applet.url" class="mt-3 mb-3">
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
            <router-link :to="{name: 'Applet', params: {appletId: applet.url}}">
            <b-row no-gutters>
              <b-col md="6">
                <b-card-img :src="`https://picsum.photos/400/400/?image=${350+index}`" class="rounded-0" />
              </b-col>
              <b-col md="6">
                <b-card-body :title="appletData[applet.url]['http://www.w3.org/2004/02/skos/core#prefLabel'][0]['@value']">
                  <b-card-text>
                    {{appletData[applet.url]['http://schema.org/description'][0]['@value']}}
                  </b-card-text>
                </b-card-body>
              </b-col>
            </b-row>
            </router-link>
          </b-card>
          
        </div>
      </div>
      <div class="mt-3 mb-3">
        <p>WIP: applets from the server</p>
        <p>{{appletsFromServer}}</p>
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
</style>

<script>
import jsonld from 'jsonld/dist/jsonld.min';
import _ from 'lodash';
import api from '../lib/api/';

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
  data() {
    return {
      appletsFromServer: {},
      appletData: {},
    };
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
      // api.getAppletsForUser({ apiHost: this.apiHost, token: this.user.authToken.token })
      //   .then((resp) => {
      //     this.appletsFromServer = resp.data;
      //   });
    },
    getAppletData() {
      _.map(this.applets, (a) => {
        jsonld.expand(a.url).then((resp) => {
          this.appletData[a.url] = resp[0];
          this.$forceUpdate();
        });
      });
    },
    addAppletToUser(appletId) {
      api.addAppletToUser({ apiHost: this.apiHost, appletId, token: this.user.authToken.token })
        .then((resp) => {
          console.log('added a new applet', resp);
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

