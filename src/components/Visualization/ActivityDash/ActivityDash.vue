<template>
  <div>
    <div v-for="(itemData, itemUrl) in data" :key="itemUrl">
      <ItemPlot :data="itemData" :itemUrl="itemUrl" />
    </div>
  </div>
</template>

<script>
import ItemPlot from '../ItemPlot';

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

    };
  },
  methods: {

  },
};
</script>

