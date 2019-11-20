<template>
  <div class="mt-3 pt-3 container">
    <div v-if="isLoggedIn">
      <div class="heading">
        <h1 v-if="status === 'ready'">
          {{user.user.firstName}}, you're invited!
        </h1>
        <h1 v-else>
          Loading Invitation
        </h1>
      </div>

      <hr>
      <div v-if="status === 'ready'">
        <div v-html="invitationText" />
        <b-button
          @click="acceptInvitation"
          class="acceptButton"
          variant="success"
          size="lg">Accept Invitation
        </b-button>
        <b-button
          @click="removeInvitation"
          class="acceptButton"
          variant="danger"
          size="lg">Decline Invitation
        </b-button>
      </div>
      <div v-if="status === 'error'">
        Invitation not found
      </div>
      <BounceLoader v-else />

    </div>
    <div v-else class="heading">
      <h1>
        Please
        <router-link to="/login">
          log in
        </router-link>
        or
        <router-link to="/signup">
          sign up
        </router-link>
        to view this invitation!
      </h1>
    </div>
  </div>
</template>

<style scoped>
  .acceptButton {
    margin-top: 18px;
  }
</style>

<script>
import api from '../lib/api/';
import BounceLoader from './BounceLoader';

export default {
  name: 'Invitation',
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
      invitationText: '',
    };
  },
  watch: {
    isLoggedIn() {
      if (this.isLoggedIn) {
        this.getInvitation();
      }
    },
  },
  mounted() {
    if (this.isLoggedIn) {
      this.getInvitation();
    } else {
      const route = `invitation/${this.$route.params.invitationId}`;
      this.$store.commit('setRedirect', route);
    }
  },
  methods: {
    getInvitation() {
      this.status = 'loading';
      api.getInvitation({
        apiHost: this.apiHost,
        token: this.user.authToken.token,
        invitationId: this.$route.params.invitationId,
      }).then((resp) => {
        this.invitationText = resp.data;
        this.status = 'ready';
      }).catch(() => {
        this.status = 'error';
      });
    },
    acceptInvitation() {
      api.acceptInvitation({
        apiHost: this.apiHost,
        token: this.user.authToken.token,
        invitationId: this.$route.params.invitationId,
      }).then((resp) => {
        console.log(resp);
      }).catch((e) => {
        console.log(e);
      });
    },
    removeInvitation() {
      api.removeInvitation({
        apiHost: this.apiHost,
        token: this.user.authToken.token,
        invitationId: this.$route.params.invitationId,
      }).then((resp) => {
        console.log(resp);
      }).catch((e) => {
        console.log(e);
      });
    },
  },
};
</script>
