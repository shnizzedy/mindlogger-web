<template>
  <div class="mt-3 pt-3 container">
    <div v-if="isLoggedIn">
      <div
        v-if="status === 'loading'"
        class="heading">
        <h1>
          Loading Invitation
        </h1>
      </div>
      <div
        v-if="status === 'ready'"
        class="invitationBody"
        v-html="invitationText" />
      <div v-else-if="status === 'error'">
        Invitation not found
      </div>
      <h1 v-else-if="status === 'accepted'">
        Invitation Accepted
      </h1>
      <h1 v-else-if="status === 'removed'">
        Invitation Removed
      </h1>
      <BounceLoader v-else />
      <ButtonGroup
        v-if="status === 'ready'"
        v-on:accept="acceptInvitation"
        v-on:remove="removeInvitation"
      />
    </div>
    <div v-else class="heading">
      Please
      <router-link to="/login">
        log in
      </router-link>
      or
      <router-link to="/signup">
        sign up
      </router-link>
      to view this invitation!
    </div>
  </div>
</template>

<style>
  .invitationBody *{
    text-align: left;
    font-size: 16px;
  }

  .invitationBody {
    text-align: left;
  }
</style>

<script>
import api from '../../lib/api/';
import BounceLoader from '../BounceLoader';
import ButtonGroup from './ButtonGroup';

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
    ButtonGroup,
    BounceLoader,
  },
  data() {
    return {
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
      this.status = 'loading';
      api.acceptInvitation({
        apiHost: this.apiHost,
        token: this.user.authToken.token,
        invitationId: this.$route.params.invitationId,
      }).then(() => {
        this.status = 'accepted';
      }).catch(() => {
      });
    },
    removeInvitation() {
      this.status = 'loading';
      // api.removeInvitation({
      //   apiHost: this.apiHost,
      //   token: this.user.authToken.token,
      //   invitationId: this.$route.params.invitationId,
      // }).then(() => {
      //   this.status = 'removed';
      // }).catch(() => {
      //   this.status = 'error';
      // });
      this.status = 'removed';
    },
  },
};
</script>
