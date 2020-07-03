import Vue from 'vue';
import Vuex from 'vuex';

import auth from './modules/auth';
// import allocator from './modules/allocator';
// import payments from './modules/payments';
import accounts from './modules/accounts';
import snackbar from './modules/snackbar';
import settings from './modules/settings';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    // allocator,
    // payments,
    accounts,
    snackbar,
    settings,
  },

  state: {},

  mutations: {},

  actions: {},
});
