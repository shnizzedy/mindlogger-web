<template>
  <div class="mt-3 pt-3 container">
    <div v-if="isLoggedIn">

      <!-- top thing with avatar and username's profile -->
      <div class="heading">
        <h1>
          <b-img v-bind="mainProps" rounded="circle" alt="Circle image" class="mr-3"></b-img>
          {{user.user.firstName}}'s Settings
        </h1>
      </div>

      <hr>

      <!-- change your password -->
      <div class="changePassword mt-3 pt-3 mb-3 pb-3">
        <h3>Change password</h3>
        <p class="lead">
        Make sure to set a complex password, and don't share it with anyone.
        <br>
        </p>

        <!-- change password form -->
        <div>
          <b-row class="my-1">
            <b-col sm="3">
              <label for="input-valid">New password:</label>
            </b-col>
            <b-col sm="9">
              <b-form-input v-model="newPassword.original"
              type="password"
              id="input-valid" placeholder="New password">
              </b-form-input>
            </b-col>
          </b-row>

          <b-row class="my-1">
            <b-col sm="3">
              <label for="input-invalid">Confirm password:</label>
            </b-col>
            <b-col sm="9">
              <b-form-input id="input-invalid" v-model="newPassword.repeat"
              type="password"
              :state="validatePass" placeholder="Confirm new password">
              </b-form-input>
            </b-col>
          </b-row>
          <b-row class="my-1 mt-3">
            <b-col>
              <b-button :disabled="!validatePass || validatePass == null || !newPassword.original"
              variant="success">Submit</b-button>
            </b-col>
          </b-row>
        </div>
      </div>

    </div>
    <div v-else>
      Please <router-link to="/login"> log in </router-link> to see the page!
    </div>
  </div>
</template>

<style>
 td {
   vertical-align: middle !important;
 }
</style>

<script>
import _ from 'lodash';
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
      // appletsFromServer: [],
      status: 'loading',
      error: {},
      options: [
        { text: 'On', value: true },
        { text: 'Off', value: false },
      ],
      newPassword: {
        original: null,
        repeat: null,
      },
      appletFields: [
        {
          key: 'image',
          label: '',
        },
        {
          key: 'name',
          label: 'Name',
        },
        {
          key: 'description',
          label: 'Description',
        },
        {
          key: 'active',
          label: 'Active',
        },
      ],
    };
  },
  watch: {
    isLoggedIn() {
      if (this.isLoggedIn) {
        this.getApplets();
      }
    },
  },
  mounted() {
    if (this.isLoggedIn) {
      this.getApplets();
    }
  },
  computed: {
    appletItems() {
      // eslint-disable-next-line
      return _.map(this.appletsFromServer, (a, index) => {
        return { name: a['http://www.w3.org/2004/02/skos/core#prefLabel'] ? a['http://www.w3.org/2004/02/skos/core#prefLabel'][0]['@value'] : '',
          url: a['schema:url'] ? a['schema:url'] : a.url || '',
          description: a['schema:description'] ? a['schema:description'][0]['@value'] : '',
          image: a['schema:image'] ? a['schema:image'] : `https://picsum.photos/400/400/?image=${350 + index}`,
          selected: true,
        };
      });
    },
    validatePass() {
      if (this.newPassword.original == null && this.newPassword.repeat == null) {
        return null;
      }
      return this.newPassword.original === this.newPassword.repeat;
    },
    appletsFromServer() {
      return this.$store.state.applets;
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
          if (resp) {
            const appletsFromServer = resp.data.map(applet => applet.applet)
              .filter(a => a['schema:url']);
            this.status = 'ready';
            this.$store.commit('setApplets', appletsFromServer);
          } else {
            this.status = 'ready';
          }
        })
        .catch((e) => {
          this.error = e;
          this.status = 'error';
        });
    },
  },
};
</script>
