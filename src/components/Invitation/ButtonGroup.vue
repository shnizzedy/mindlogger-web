<template>
  <div>
    <b-button
      @click="triggerAcceptInvitation"
      class="button"
      variant="success"
      size="lg">
      Accept Invitation
    </b-button>
    <b-button
      @click="triggerRemoveInvitation"
      class="button"
      variant="danger"
      size="lg">
      Decline Invitation
    </b-button>
  </div>
</template>

<style scoped>
  .button {
    margin: 4px;
  }
</style>

<script>
export default {
  name: 'ButtonGroup',
  props: {
    invitationId: {
      type: String,
    },
    status: {
      type: String,
    },
    apiHost: {
      type: String,
    },
  },
  methods: {
    triggerAcceptInvitation() {
      this.$emit('accept');
    },
    triggerRemoveInvitation() {
      this.$emit('remove');
    },
  },
};
</script>
