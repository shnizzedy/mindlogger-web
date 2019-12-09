<template>
  <div class="mt-3 mb-3">
    <p class="text-muted">{{description}}</p>
    <div>
      <BarTime :values="meaningfulData" :encoding="encoding"/>
    </div>
    <!-- <div v-else>
      <b-alert show variant="warning">
        We don't know how to plot this datatype: {{inputType}}
      </b-alert>
    </div> -->
  </div>
</template>

<script>
import jsonld from 'jsonld/dist/jsonld.min';
import _ from 'lodash';
import BarTime from '../BarTime';

export default {
  name: 'ItemPlot',
  props: {
    data: {
      type: Array,
    },
    itemUrl: {
      type: String,
    },
  },
  components: {
    BarTime,
  },
  data() {
    return {
      metadata: {},
      meaningfulResponses: {},
    };
  },
  computed: {
    inputType() {
      if (!_.isEmpty(this.metadata)) {
        return this.metadata['reprolib:terms/inputType'][0]['@value'];
      }
      return null;
    },
    description() {
      if (!_.isEmpty(this.metadata)) {
        return this.metadata['schema:description'][0]['@value'];
      }
      return null;
    },
    /**
     * vega datatype
     * TODO: make this a computed property from the schema.
     * for now, guess what the datatype is based on the UI input type.
     * Vega options: 'quantitative', 'temporal', 'ordinal', 'nominal'
     */
    datatype() {
      return this.getItemVegaType(this.inputType);
    },
    /**
     * VEGA encoding
     */
    encoding() {
      // if the datatype isn't known, then only show the times of the responses.
      const x = { field: 'time_of_response', type: 'temporal', timeUnit: 'yearmonthdate' };
      const y = { field: 'label', type: this.datatype };
      if (this.datatype) {
        return {
          x,
          y,
        };
      }
      return { x };
    },
    /**
     * data with added meaninful responses.
     * lets also remove any skipped or dontknow responses.
     */
    meaningfulData() {
      const cleaned = _.map(this.data, (d) => {
        if (this.meaningfulResponses[d.response]) {
          return { ...d, label: this.meaningfulResponses[d.response] };
        }
        return { ...d, label: d.response };
      });
      return _.filter(cleaned, c => c.response !== 'skipped' && c.response !== 'dontKnow');
    },
  },
  methods: {
    getItemMetadata() {
      jsonld.expand(this.itemUrl).then((resp) => {
        this.metadata = resp[0];

        // check if the valueconstraints need to be expanded.
        if (this.metadata['reprolib:terms/valueconstraints'][0]['@id']) {
          jsonld.expand(this.metadata['reprolib:terms/valueconstraints'][0]['@id']).then((vc) => {
            this.metadata['reprolib:terms/valueconstraints'] = vc;
            this.meaningfulResponses = this.getMeaningfulResponses();
            this.$forceUpdate();
          });
        } else {
          this.meaningfulResponses = this.getMeaningfulResponses();
        }
      });
    },
    getItemVegaType() {
      switch (this.inputType) {
        case 'radio':
          return 'nominal';
        case 'slider':
          return 'ordinal';
        default:
          return null;
      }
    },
    /**
     * get the meaningful responses based on the items metadata
     * specifically, check input type and valueconstraints
     */
    getMeaningfulResponses() {
      const output = {};
      const vc = this.metadata['reprolib:terms/valueconstraints'];
      if (this.inputType === 'radio') {
        if (vc[0]['schema:itemListElement']) {
          const options = vc[0]['schema:itemListElement'][0]['@list'];
          _.map(options, (o) => {
            const key = o['schema:value'][0]['@value'];
            const value = o['schema:name'][0]['@value'];
            output[key] = value;
          });
        } else {
          // eslint-disable-next-line
          console.log('something wrong with options', vc[0]);
        }
      }
      return output;
    },
  },
  mounted() {
    this.getItemMetadata();
  },
};
</script>
