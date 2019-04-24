import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
  applets: [],
  appletData: {},
};

const getters = {

};

const mutations = {
  setApplets(state, data) {
    state.applets = data;
  },
  setAppletData(state, appletURI, data) {
    state.appletData[appletURI] = data;
  },
};

const actions = {

};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
});
