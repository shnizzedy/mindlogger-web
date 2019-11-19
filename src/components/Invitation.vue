<template>
  <div class="mt-3 pt-3 container">
    <div v-if="isLoggedIn">

      <!-- top thing with avatar and username's profile -->
      <div class="heading">
        <h1 v-if="status === 'ready'">
          {{user.user.firstName}}, you're invited!
        </h1>
        <h1 v-else>
          Loading Invitation
        </h1>
      </div>

      <hr>
      <div
        v-if="status === 'ready'"
        v-html="inviteText" >
      </div>
      <BounceLoader v-else />

    </div>
    <div v-else class="heading">
      <h1>
        Please <router-link to="/login"> log in </router-link> or <router-link to="/signup"> sign up </router-link> to view this invitation!
      </h1>
    </div>
  </div>
</template>

<style>
 td {
   vertical-align: middle !important;
 }
</style>

<script>
import api from '../lib/api/';
import BounceLoader from './BounceLoader';

export default {
  name: 'Profile',
  props: {
    user: {
      type: Object,
    },
    isLoggedIn: {
      type: Boolean,
    },
    apiHost: {
      type: String,
    },
  },
  components: {
    BounceLoader,
  },
  data() {
    return {
      mainProps: { blank: true,
        blankColor: '#777',
        width: 75,
        height: 75,
        class: 'm1' },
      imgProps: { blank: false,
        width: 50,
        height: 50,
        class: 'm1' },
      status: 'loading',
      inviteText: '',
    };
  },
  watch: {
    isLoggedIn() {
      if (this.isLoggedIn) {
        this.getInvite();
      }
    },
  },
  mounted() {
    if (this.isLoggedIn) {
      this.getInvite();
    }
  },
  methods: {
    getInvite() {
      this.status = 'loading';
      api.getInvite({
        apiHost: this.apiHost,
        token: this.user.authToken.token,
        invitationId: this.$route.params.invitationId,
      }).then((resp) => {
        console.log('resp');
        console.log(resp);
        this.status = 'ready';
        this.inviteText = resp.data;
      }).catch((e) => {
        console.log('error:');
        console.log(e);
      });
    },
  },
};
</script>
