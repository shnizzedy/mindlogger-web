<template>
  <div class="container mt-3">
    <div v-if="!isLoggedIn">
      You're not logged in!
    </div>
    <div v-else>
      <h1>{{user.user.firstName}}'s Applets</h1>
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
  },
  data() {
    return {
      appletsFromServer: {},
    };
  },
  mounted() {
    api.getAppletsForUser({ apiHost: this.apiHost, token: this.user.authToken.token })
      .then((resp) => {
        this.appletsFromServer = resp.data;
      });
  },
};
</script>

