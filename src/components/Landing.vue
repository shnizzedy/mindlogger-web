<template>
  <div class="mt-3">
    <div>
      <h1>Welcome to Mindlogger!</h1>
      <p class="lead">
        Mindlogger is an online data collection platform for scientific research.
      </p>
      <img style="max-width:500px; width:100%" src="@/assets/undraw_data_xmfy.svg" />
      <div v-if="!isLoggedIn">
        <p class="mt-3">
          To get started:
        </p>
        <b-button to="/login" variant="primary" size="lg">Log In</b-button>
        or
        <b-button to="/signup" variant="success" size="lg">Sign Up</b-button>
      </div>
      <div class="mt-3" v-else>
        <b-button :to="{name: 'AllApplets', query}"
        variant="danger" size="lg">Get Started</b-button>
      </div>
    </div>
  </div>
</template>

<style></style>

<script>
export default {
  name: 'Landing',
  props: {
    isLoggedIn: {
      type: Boolean,
    },
    query: {
      type: Object,
    },
  },
};
</script>
