import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const state = {
  applets: [],
  appletResponses: {},
};

const getters = {

};

const mutations = {
  setApplets(state, data) {
    state.applets = data;
  },
  setAppletResponses(state, { appletURI, data }) {
    state.appletResponses[appletURI] = data;
  },
};

const actions = {

};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  plugins: [createPersistedState()],
});
