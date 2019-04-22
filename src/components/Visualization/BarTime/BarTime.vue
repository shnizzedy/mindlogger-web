<template>
 <div class='dashboard text-center mx-auto' ref="parent">
   <resize-observer @notify="handleResize" />
    <vega-lite class="mx-auto" :data="values" mark="circle"
    :encoding="encoding" autoResize :width="width"/>
 </div>
</template>

<style>
  .mx-auto svg {
    margin-left: auto;
    margin-right: auto;
  }
</style>

<script>
/* eslint-disable */
import Vue from 'vue';
import VueVega from 'vue-vega';
import 'vue-resize/dist/vue-resize.css';
import { ResizeObserver } from 'vue-resize';

Vue.component('resize-observer', ResizeObserver);

Vue.use(VueVega);

export default{
  name: 'BarTimeSpec',
  props: {
    values: {
      type: Array,
    },
    encoding: {
      type: Object,
    },
  },
  data() {
    return {
      // values: [
      //   { a: 'A', b: 28 }, { a: 'B', b: 55 }, { a: 'C', b: 43 },
      //   { a: 'D', b: 91}, {a: 'E', b: 81}, {a: 'F', b: 53},
      //   { a: 'G', b: 19}, {a: 'H', b: 87}, {a: 'I', b: 52}
      // ],
      // encoding: {
      //   x: {field: 'a', type: 'ordinal'},
      //   y: {field: 'b', type: 'quantitative'}
      // },
      width: 200,
    }
  },
  methods: {
    handleResize() {
      this.width = this.$refs.parent.clientWidth * 0.75;
    }
  },
  mounted() {
    this.width = this.$refs.parent.clientWidth * 0.75;
  }
}
</script>
