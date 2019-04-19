<template>
  <div class="mt-3 pt-3 container">
    <div v-if="status === 'loading'">
      <BounceLoader />
    </div>
    <div v-else-if="status === 'error'">
      <b-alert show variant="danger">Something went wrong!</b-alert>
    </div>
    <div v-else-if="!responses.length && this.status === 'ready'">
      You haven't saved any data yet.
    </div>
    <div v-else class="mb-3">
        <div>
          <h1>Your Data</h1>
          <p class="lead">
            {{applet.name}}
          </p>
        </div>
        <div>
          <v-calendar
          is-expanded
          :attributes="calendarAttributes"
          >
          </v-calendar>
        </div>
    </div>

  </div>
</template>

<style></style>

<script>
import moment from 'moment';
import Vue from 'vue';
import '@babel/polyfill';
import VCalendar from 'v-calendar';
import _ from 'lodash';
import api from '../lib/api';
import BounceLoader from './BounceLoader';

Vue.use(VCalendar, {
  firstDayOfWeek: 2, // Monday
});

export default {
  name: 'appletDashboard',
  props: {
    isLoggedIn: {
      type: Boolean,
    },
    user: {
      type: Object,
    },
    apiHost: {
      type: String,
    },
    appletUrl: {
      type: String,
    },
    applet: {
      type: [Object, String],
    },
  },
  components: { BounceLoader },
  data() {
    return {
      responseDates: [],
      responses: [],
      status: 'loading',
    };
  },
  mounted() {
    if (_.isObject(this.applet) && this.isLoggedIn) {
      if (this.applet.url) {
        this.getUserResponses();
      }
    }
  },
  watch: {
    applet() {
      if (_.isObject(this.applet) && this.isLoggedIn) {
        if (this.applet.url) {
          this.getUserResponses();
        }
      }
    },
    isLoggedIn() {
      if (_.isObject(this.applet) && this.isLoggedIn) {
        if (this.applet.url) {
          this.getUserResponses();
        }
      }
    },
  },
  computed: {
    calendarAttributes() {
      return [{
        key: 'tester',
        dot: true,
        dates: this.responseDates,
      },
      {
        key: 'today',
        highlight: {
          color: 'blue',
          fillMode: 'light',
        },
        dates: new Date(),
      }];
    },
  },
  methods: {
    getUserResponses() {
      this.status = 'loading';
      api.getAppletFromURI({
        apiHost: this.apiHost,
        token: this.user.authToken.token,
        URI: this.applet.url,
      }).then(resp => api.getUserDataFromApplet({
        apiHost: this.apiHost,
        token: this.user.authToken.token,
        userId: this.user.user._id,
        appletId: resp.data._id,
      })).then((resp) => {
        this.responses = resp.data;
        this.parseDates();
      }).catch(() => {
        this.status = 'error';
      });
    },
    parseDates() {
      // TODO: make these UNIQUE days.
      // eslint-disable-next-line
      this.responseDates = _.map(this.responses, (r) => {
        // TODO: use a nice ISO-formatted date that isn't updated
        // when the user's response is for a different day than when
        // they responded.
        return moment(r.updated).startOf('day').toDate();
      });
      this.status = 'ready';
    },
  },
};
</script>

