<template>
  <div class="mt-3 pt-3 container">
    <div v-if="status === 'loading' && !responses.length">
      <BounceLoader />
    </div>
    <!-- <div v-else-if="status === 'error'">
      <b-alert show variant="danger">Something went wrong!</b-alert>
    </div> -->
    <div v-else-if="!responses.length && this.status === 'ready'">
      You haven't saved any data yet.
    </div>
    <div v-else class="mb-3">
        <div>
          <div class="text-right text-muted" v-if="status==='loading' && responses.length">
            <small>refreshing
            <i class="fas fa-sync fa-spin ml-1"></i></small>
          </div>
          <div v-if="status === 'error'">
            <b-alert show variant="danger">Something went wrong!</b-alert>
          </div>
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
        <div class="mt-3" v-for="(val, act) in datatables" :key="act">
          <ActivityDash :data="val" :activityUrl="act"/>
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
import ActivityDash from './Visualization/ActivityDash';


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
  components: {
    BounceLoader,
    ActivityDash,
  },
  data() {
    return {
      // responseDates: [],
      responses: [],
      status: 'loading',
      // datatables: {},
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
    responseDates() {
      if (this.responses.length) {
        return this.parseDates(this.responses);
      }
      return [];
    },
    datatables() {
      return this.createDataTables();
    },
  },
  methods: {
    getUserResponses() {
      this.status = 'loading';
      /**
       * if there is something in the store, use it.
       */
      if (this.$store.state.appletResponses[this.appletUrl]) {
        this.responses = this.$store.state.appletResponses[this.appletUrl];
      }
      api.getAppletFromURI({
        apiHost: this.apiHost,
        token: this.user.authToken.token,
        URI: this.appletUrl,
        // eslint-disable-next-line
      }).then((resp) => {
        /**
         * TODO: this is messy: resp.data.applet._id.split('/')[1]
         * lets fix this in the future.
         */
        return api.getUserDataFromApplet({
          apiHost: this.apiHost,
          token: this.user.authToken.token,
          userId: this.user.user._id,
          appletId: resp.data.applet._id.split('/')[1],
        });
      }).then((resp) => {
        const responses = resp.data;
        this.$store.commit('setAppletResponses', { appletURI: this.appletUrl, data: responses });
        this.responses = responses;
        this.status = 'ready';
        this.$forceUpdate();
      }).catch(() => {
        this.status = 'error';
      });
    },
    parseDates(responses) {
      // TODO: make these UNIQUE days.
      // eslint-disable-next-line
      const responseDates = _.map(responses, (r) => {
        // TODO: use a nice ISO-formatted date that isn't updated
        // when the user's response is for a different day than when
        // they responded.
        return moment(r.updated).startOf('day').toDate();
      });
      // this.$store.commit('setAppletResponseDates',
      // { appletURI: this.appletUrl, data: responseDates });
      this.status = 'ready';
      // this.createDataTables();
      return responseDates;
    },
    /**
     * We need to create tabular data to plot.
     * For each activity, and for each item, we need
     * tabular data, and we need to know its timescale,
     * and how we plot it. We should get this information from
     * the item URL. In the future, we may be able to encode
     * variable relationships at the activity level, and activity-set
     * level!
     */
    createDataTables() {
      // go through all the responses and group them by activity and item.
      const tables = {};
      _.map(this.responses, (resp) => {
        const meta = resp.meta;

        // initialize a spot for the activity URI
        if (!tables[meta.activity.url]) {
          tables[meta.activity.url] = {};
        }

        _.map(meta.responses, (val, key) => {
          // initialize a spot for this item within the activity
          if (!tables[meta.activity.url][key]) {
            tables[meta.activity.url][key] = [];
          }

          // push the response's information to the activity/item pair.
          // TODO: we need to tell Vega what kind of response this is
          // based on the metadata of the item!
          // TODO: we need to encode *meaningful* responses here, based on the
          // item metadata, not the numeric response
          tables[meta.activity.url][key].push({
            response: val,
            time_of_response: moment(resp.updated).toDate() });
        });
      });
      // this.datatables = tables;
      return tables;
    },
  },
};
</script>

