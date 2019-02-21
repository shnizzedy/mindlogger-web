<template name="login">
  <div id="login" class="text-center mb-0">
    <h1> Log In </h1>

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

      <p class="mt-3">
        Don't have an account? <router-link to="/signup">Create one</router-link>
      </p>
      <p class="mt-3">
        Forgot your password? <router-link to="/forgot">Reset it</router-link>
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
import api from '../../lib/api/api';


// console.log(signin);
export default {
  name: 'login',
  props: {
    apiHost: {
      type: String,
    },
  },
  data() {
    return {
      status: 'ready',
      form: {
        username: null,
        password: null,
      },
      errors: {
        message: null,
        show: false,
        code: null,
      },
    };
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      this.status = 'loading';
      api.signIn({ apiHost: this.apiHost,
        user: this.form.username,
        password: this.form.password }).then((resp) => {
        this.$emit('login', resp.data);
        // this.$router.push('/activitySets');
        this.status = 'ready';
      }).catch((err) => {
        this.errors.code = err.response;
        if (this.errors.code.status === 401) {
          this.errors.message = 'We have no record of your username. Please create a new account!';
        } else {
          this.errors.message = err.message;
        }
        this.errors.show = true;
        this.status = 'ready';
      });
    },
  },
};
</script>
