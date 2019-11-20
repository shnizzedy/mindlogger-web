<template name="signup">
  <div id="signup" class="pt-3 ">
    <div class="">
    <h1 class="text-center" v-if="useTitle"> Sign Up </h1>
    <!-- Modal Component -->

    <div id="signupForm" class="container fluid">
      <b-form @submit="onSubmit" validated>
        <b-alert :show="errors.show" variant="danger">{{errors.message}}</b-alert>

        <b-form-group id="emailAddressInputGroup"
                      label="Email address:"
                      label-for="emailAddress"
                      description="We'll never share your email with anyone else.">
          <b-form-input id="emailAddress"
                        type="email"
                        v-model="form.email"
                        required
                        :disabled="freezeEmail"
                        placeholder="Enter email">
          </b-form-input>
        </b-form-group>
        <b-form-group id="usernameInputGroup"
                      label="Username:"
                      label-for="usernameInput"
                      description="">
          <b-form-input id="usernameInput"
                        type="text"
                        v-model="form.login"
                        required
                        placeholder="Choose a username">
          </b-form-input>
        </b-form-group>

        <b-form-group id="firstNameInputGroup"
                      label="First Name:"
                      label-for="firstNameInput"
                      description="">
          <b-form-input id="firstNameInput"
                        type="text"
                        v-model="form.firstName"
                        required
                        placeholder="First Name">
          </b-form-input>
        </b-form-group>

        <b-form-group id="lastNameInputGroup"
                      label="Last Name:"
                      label-for="lastNameInput"
                      description="">
          <b-form-input id="lastNameInput"
                        type="text"
                        v-model="form.lastName"
                        required
                        placeholder="Last Name">
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

        <b-form-group id="password2InputGroup"
                      label="Confirm Password:"
                      label-for="password2Input">
          <b-alert :show="!validated" variant="danger">
            Make sure your passwords match!
          </b-alert>
          <b-form-input id="password2Input"
                        type="password"
                        v-model="form.password2"
                        required
                        placeholder="Confirm password">
          </b-form-input>
        </b-form-group>


        <b-button type="submit" variant="primary" :disabled="status==='loading' || !validated">
          <span v-if="status==='ready'">Submit</span>
          <span v-else>Signing up...</span>
        </b-button>

        <p class="mt-3" v-if="loginLink">
          Already have an account? <router-link :to="loginWithQuery">Log In</router-link>
        </p>

      </b-form>
    </div>
  </div>
  </div>
</template>
<style>
#signup {
  min-height: 100vh;
}
#signupForm {
  max-width: 400px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0px 0 7px 0px #80808036;
}
</style>

<script>
import _ from 'lodash';
import api from '../../lib/api';

/**
 * # SignUp
 * #### component for mindlogger-web to mindlogger-backend
 *
 * ## props
 * * `apiHost` : String, url to mindlogger-server, a Girder
 * * `loginLink` : String, a string that points to a router view (optional)
 */

export default {
  name: 'signup',
  props: {
    apiHost: {
      type: String,
    },
    loginLink: {
      type: Object,
      default() {
        return {};
      },
    },
    query: {
      type: Object,
    },
    useTitle: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      status: 'ready',
      form: {
        email: '',
        password: '',
        password2: '',
        login: '',
        firstName: '',
        lastName: '',
      },
      show: true,
      freezeEmail: false,
      errors: {
        show: false,
        message: null,
        code: null,
      },
    };
  },
  computed: {
    validated() {
      return this.form.password === this.form.password2;
    },
    loginWithQuery() {
      return { ...this.loginLink, query: this.query };
    },
  },
  mounted() {
    // eslint-disable-next-line
    console.log(this.$route.query);
    if (this.$route.query.email) {
      this.freezeEmail = true;
      this.form.email = this.$route.query.email;
    }
  },
  methods: {
    /**
    * Submit registration info to the server, and then save the response to the parent component.
    */
    onSubmit(e) {
      e.preventDefault();
      this.status = 'loading';
      api.signUp(this.apiHost, {
        email: this.form.email,
        password: this.form.password,
        login: this.form.login,
        firstName: this.form.firstName,
        lastName: this.form.lastName,
      }).then((resp) => {
        /*
          make the response look the same as the login response
        */
        this.status = 'ready';
        const keys = _.filter(Object.keys(resp.data), k => k !== 'authToken');
        const cleanedUser = {};
        _.map(keys, (k) => {
          cleanedUser[k] = resp.data[k];
        });
        // tell the parent we've logged in with this token info.
        this.$emit('login', { authToken: resp.data.authToken, user: cleanedUser });
        this.$router.push(this.$store.state.redirect);
        this.$store.commit('setRedirect', 'Profile');
      }).catch((err) => {
        this.errors.show = true;
        this.errors.code = err.response;
        try {
          this.errors.message = err.response.data.message;
        } catch (x) {
          this.errors.message = err.message;
        }
        this.status = 'ready';
      });
    },
  },
};
</script>
