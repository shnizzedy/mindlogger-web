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
        <div v-for="applet in applets" :key="applet.url">
          <router-link :to="{name: 'Applet', params: {appletId: applet.url}}">
            {{applet.url}}
          </router-link>
        </div>
      </div>
      <div class="mt-3 mb-3">
        <p>WIP: applets from the server</p>
        <p>{{appletsFromServer}}</p>
      </div>
    </div>
  </div>
</template>

<script>
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
    };
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
      api.getAppletsForUser({ apiHost: this.apiHost, token: this.user.authToken.token })
        .then((resp) => {
          this.appletsFromServer = resp.data;
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
    }
  },
};
</script>

