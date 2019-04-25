<template name="login">
  <div id="login" class="text-center mb-0">
    <h1 v-if="useTitle"> Log In </h1>

    <div id="signupForm" class="container fluid">
      <b-alert :show="errors.show" variant="danger">{{errors.message}}</b-alert>
      <b-form @submit="onSubmit">
        <b-form-group id="usernameInputGroup"
                      label="Username:"
                      label-for="username"
                      >
          <b-form-input id="username"
                        v-model="form.username"
                        required
                        placeholder="Enter email">
          </b-form-input>
        </b-form-group>


        <b-form-group id="passwordInputGroup"
                      label="Password:"
                      label-for="passwordInput">
          <b-form-input id="passwordInput"
                        type="password"
                        v-model="form.password"
                        required
                        placeholder="Password">
          </b-form-input>
        </b-form-group>


        <b-button type="submit" variant="primary" :disabled="status==='loading'">
          <span v-if="status==='ready'">Submit</span>
          <span v-else>Logging in...</span>
        </b-button>

      </b-form>

      <p class="mt-3" v-if="signupLink">
        Don't have an account? <router-link :to="signupWithQuery">Create one</router-link>
      </p>
      <p class="mt-3" v-if="forgotLink">
        Forgot your password? <router-link :to="forgotLink">Reset it</router-link>
      </p>
    </div>

  </div>
</template>

<style>
  #login {
    /* min-height: 100vh; */
  }

  #signupForm {
    max-width: 400px;
    padding: 20px;
    margin-top: 20px;
    box-shadow: 0px 0 7px 0px #80808036;
  }
</style>

<script>
import api from '../../lib/api';

/**
 * # Login
 *
 * This is the login UI component for
 * mindlogger.
 *
 * ** note ** this component requires the bootstrap-vue library
 * as a globally registered component.
 *
 * ## Props
 *
 * * `apiHost` : the URL for the girder-api, ending with `/api/v1`
 * * `signupLink` : a router-link location to go if the user doesn't have an account.
 * * `forgotLink` : a router-link location to go if the user forgot their password.
 *
 * ## Events
 *
 * * `login` : returns a promise with the data from the authentcation route.
 */

export default {
  name: 'login',
  props: {
    /**
     * the girder API endpoint
     */
    apiHost: {
      type: String,
    },
    signupLink: {
      type: Object,
      default() {
        return {};
      },
    },
    forgotLink: {
      type: String,
      default: '',
    },
    query: {
      type: Object,
    },
    useTitle: {
      type: Boolean,
      default: true,
    },
    redirect: {
      type: [Object, String],
      default: () => ({ name: 'AllApplets', query: this.query }),
    },
  },
  data() {
    return {
      /**
       * ### status
       *
       * status of the component, 'ready' or
       * set to 'loading' during login
       */
      status: 'ready',
      /**
       * ### form
       *
       * An object with `username` and `passord`
       * to store and eventually send to the endpoint.
       */
      form: {
        username: null,
        password: null,
      },
      /**
       * ### errors
       *
       * An object to store error messages, code,
       * and whether or not to show the error.
       */
      errors: {
        message: null,
        show: false,
        code: null,
      },
    };
  },
  computed: {
    signupWithQuery() {
      return { ...this.signupLink, query: this.query };
    },
  },
  methods: {
    /**
     * ### onSubmit(e)
     *
     * Method to submit data to the api library.
     * Sets the status to 'loading', attempts to sign in
     * and then displays an error if something went wrong.
     */
    onSubmit(e) {
      e.preventDefault();
      this.status = 'loading';
      api.signIn({ apiHost: this.apiHost,
        user: this.form.username,
        password: this.form.password }).then((resp) => {
        this.$emit('login', resp.data);
        this.$router.push(this.redirect);
        this.status = 'ready';
      }).catch((err) => {
        this.errors.code = err.response;
        try {
          this.errors.message = this.errors.code.data.message;
        } catch (error) {
          this.errors.message = err.message;
        }

        this.errors.show = true;
        this.status = 'ready';
      });
    },
  },
};
</script>
