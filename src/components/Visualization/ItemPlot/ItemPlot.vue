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
        return this.metadata['https://schema.repronim.org/inputType'][0]['@value'];
      }
      return null;
    },
    description() {
      if (!_.isEmpty(this.metadata)) {
        return this.metadata['http://schema.org/description'][0]['@value'];
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
        if (this.metadata['https://schema.repronim.org/valueconstraints'][0]['@id']) {
          jsonld.expand(this.metadata['https://schema.repronim.org/valueconstraints'][0]['@id']).then((vc) => {
            this.metadata['https://schema.repronim.org/valueconstraints'] = vc;
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
      const vc = this.metadata['https://schema.repronim.org/valueconstraints'];
      if (this.inputType === 'radio') {
        if (vc[0]['http://schema.org/itemListElement']) {
          const options = vc[0]['http://schema.org/itemListElement'][0]['@list'];
          _.map(options, (o) => {
            const key = o['http://schema.org/value'][0]['@value'];
            const value = o['http://schema.org/name'][0]['@value'];
            output[key] = value;
          });
        } else {
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

