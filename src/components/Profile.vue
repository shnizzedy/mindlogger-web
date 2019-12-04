<template>
  <div class="mt-3 pt-3 container">
    <div v-if="isLoggedIn">

      <!-- top thing with avatar and username's profile -->
      <div class="heading">
        <h1>
          <b-img v-bind="mainProps" rounded="circle" alt="Circle image" class="mr-3"></b-img>
          {{user.user.firstName}}
        </h1>
      </div>

      <hr>

      <div v-if="isMobile()">

        Download MindLogger to get started.
        <div>
          <a href='config.mobileAppLinks.iOS'>
            <img class="linkAndroid" alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png'/>
          </a>

          <a href='config.mobileAppLinks.iOS'>
            <img class="linkApple" alt='Get it on Apple Test Flight' src='https://developer.foursquare.com/docs/images/testflight-badge.png'/>
          </a>
        </div>
      </div>

      <div v-else>
        Thank you for creating an account with MindLogger.
        Download MindLogger on an iOS or Android device to get started.
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

 .linkAndroid {
   margin-top: 8px;
   width: 52%;
 }
 .linkApple {
   margin-top: 8px;
   width: 44%
 }
</style>

<script>
// import Loader from '@bit/akeshavan.mindlogger-web.loader';
import _ from 'lodash';
import api from '../lib/api/';
import config from '../config';
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
      config,
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
          if (resp) {
            const appletsFromServer = resp.data.map(applet => applet.applet)
              .filter(a => a['http://schema.org/url']);
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
    isMobile() {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
      }
      return false;
    },
  },
};
</script>
