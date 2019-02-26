<template>
  <b-button :variant="variant" :size="size" @click="click">
    <span v-if="!ready" disabled variant="warning">saving...</span>
    <span v-else>{{label}}</span>
  </b-button>
</template>

<script>
export default {
  name: 'SaveButton',
  props: {
    ready: {
      type: Boolean,
    },
    label: {
      type: String,
    },
    variant: {
      type: String,
      default: 'primary',
    },
    size: {
      type: String,
      default: 'lg',
    },
    click: {
      type: Function,
    },
  },
};
</script>

