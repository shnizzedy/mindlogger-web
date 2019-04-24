<template>
  <div>
    <div v-for="(itemData, itemUrl) in cleanedData" :key="itemUrl">
      <ItemPlot :data="itemData" :itemUrl="itemUrl" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import jsonld from 'jsonld/dist/jsonld.min';
import ItemPlot from '../ItemPlot';
import moment from 'moment';

export default {
  name: 'ActivityDash',
  props: {
    data: {
      type: Object,
    },
    activityUrl: {
      type: String,
    },
  },
  components: {
    ItemPlot,
  },
  data() {
    return {
      metadata: {},
    };
  },
  computed: {
    activityTimeUnit() {
      if (!_.isEmpty(this.metadata)) {
        if (this.metadata[0]['https://schema.repronim.org/timeUnit']) {
          return this.metadata[0]['https://schema.repronim.org/timeUnit'][0]['@value']
        }
        return null;
      }
      return null;
    },
    cleanedData() {
      const cleanedData = {};
      switch (this.activityTimeUnit) {
        case 'yearmonthdate':
          _.map(this.data, (itemData, itemURI) => {
            cleanedData[itemURI] = this.getByDate(itemData);
          });
          return cleanedData;

        default:
          return this.data;
      }
    },
  },
  methods: {
    getActivityMetadata() {
      jsonld.expand(this.activityUrl).then((resp) => {
        this.metadata = resp;
      });
    },
    getByDate(data) {
      const dayGroups = _.groupBy(data, d => moment(d.time_of_response).startOf('day').toISOString());
      // const output = [];
      return _.map(dayGroups, d => _.last(d));
    },
  },
  mounted() {
    this.getActivityMetadata();
  },
};
</script>

