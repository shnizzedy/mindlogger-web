<template>
  <div class="mt-3 pt-3 container">
    <div v-if="isLoggedIn">

      <!-- top thing with avatar and username's profile -->
      <div class="heading">
        <h1>
          <b-img v-bind="mainProps" rounded="circle" alt="Circle image" class="mr-3"></b-img>
          {{user.user.firstName}}'s Profile
        </h1>
      </div>

      <hr>

      <!-- list of studies that the user is enrolled in -->
      <div class="yourStudies mt-3 pt-3 mb-3 pb-3">
      <div class="text-right text-muted" v-if="status==='loading' && appletsFromServer.length">
        <small>refreshing
        <i class="fas fa-sync fa-spin ml-1"></i></small>
      </div>
        <h2>Your studies</h2>
        <p class="lead">
          Below are the studies that you have enrolled in.
          <br>
          You can remove yourself from these studies at any time.
        </p>

        <div class="userApplets">
          <!-- Loading status-->
          <div v-if="status==='loading' && !appletsFromServer.length">
            <BounceLoader />
          </div>
          <!-- Ready to show the applets -->
          <div v-else>
            <b-table borderless striped hover responsive :items="appletItems" :fields="appletFields"
              tbody-td-class="align-middle">
              <!-- A custom formatted column -->
              <template slot="image" slot-scope="data">
                 <b-img rounded="circle" alt="Circle image" :src="data.value" v-bind="imgProps">

                 </b-img>
              </template>

              <template slot="name" slot-scope="data">
                <router-link :to="`/applet/${encodeURIComponent(data.item.url)}`">
                  {{data.value}}
                </router-link>
              </template>

              <template slot="active" slot-scope="data">
                <b-form-group class="align-middle">
                  <b-form-radio-group
                    id="btn-radios-2"
                    v-model="data.item.selected"
                    :options="options"
                    buttons
                    button-variant="outline-primary"
                    size="sm"
                    class="pt-3"
                    name="radio-btn-outline"
                  ></b-form-radio-group>
                </b-form-group>
              </template>

            </b-table>
          </div>
        </div>

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
// import Loader from '@bit/akeshavan.mindlogger-web.loader';
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
          url: a['http://schema.org/url'] ? a['http://schema.org/url'][0]['@value'] : a['http://schema.org/url'] || a.url || '',
          description: a['http://schema.org/description'] ? a['http://schema.org/description'][0]['@value'] : '',
          image: a['http://schema.org/image'] ? a['http://schema.org/image'][0]['@value'] : a['http://schema.org/image'] || `https://picsum.photos/400/400/?image=${350 + index}`,
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
        const appletsFromServer = resp.data.map(applet => applet.applet)
          .filter(a => a['http://schema.org/url']);
        this.status = 'ready';
        this.$store.commit('setApplets', appletsFromServer);
      })
      .catch((e) => {
        this.error = e;
        this.status = 'error';
      });
    },
  },
};
</script>
