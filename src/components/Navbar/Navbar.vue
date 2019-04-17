<template>
    <b-navbar toggleable="md" type="dark" class="site-header">

      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand to="/" exact>Mindlogger</b-navbar-brand>

      <b-navbar-nav class="ml-auto">
        <b-nav-item v-if="isLoggedIn" :to="{name: 'AllApplets', query}">Home</b-nav-item>
      </b-navbar-nav>

      <b-collapse is-nav id="nav_collapse">

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">

          <b-nav-item-dropdown right v-if="isLoggedIn">
            <!-- Using button-content slot -->
            <template slot="button-content">
              <em>{{user.login}}</em>
            </template>
            <b-dropdown-item to="/profile">Profile</b-dropdown-item>
            <b-dropdown-item @click="logout">Signout</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item v-else :to="{name: 'Login', query }">Login</b-nav-item>

        </b-navbar-nav>

      </b-collapse>
    </b-navbar>
</template>

<script>
export default {
  name: 'Navbar',
  props: {
    isLoggedIn: {
      type: Boolean,
    },
    user: {
      type: Object,
    },
    logout: {
      type: Function,
    },
    query: {
      type: Object,
    },
  },
};
</script>

