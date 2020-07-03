import { LocalStorage as LS } from '@apollo4u/auxiliary';
import { API, AUTH, ATTACHMENT } from '@/env';
import router from '@/router';
// import auth from '@/api/auth';
// import errorHandler from '@/utils/error-handler';
import snackbar from '@/utils/snackbar';

// String.prototype.capitalyze = () => this[0].toUpperCase()
const capitalize = str => str[0].toUpperCase() + str.slice(1);

const prefix = 'setting_';

const defaults = {
  invoiceLength: 6,
  importFileSizeLimit: 100000,
  defaultTab: 'allocator',
  enableBills: false,

  apiTimeout: 5000,
  authTimeout: 5000,
  apiIp: API.ip,
  apiPort: API.port,
  authIp: AUTH.ip,
  authPort: AUTH.port,
  attachmentIp: ATTACHMENT.ip,
  attachmentPort: ATTACHMENT.port,
};

// get settings from LocalStorage
function getLSConfig() {
  const LSConfig = {};
  for (const prop in defaults) {
    const fromLS = LS.getItem(prefix + prop);
    if (fromLS != undefined) LSConfig[prop] = fromLS;
  }
  return LSConfig;
}

export default {
  namespaced: true,

  state: {
    ...defaults,
    ...getLSConfig(),
  },

  getters: {},

  mutations: {
    setApiIp(state, value) {
      state.apiIp = value;
      LS.setItem(prefix + 'apiIp', value);
    },
    setApiPort(state, value) {
      state.apiPort = value;
      LS.setItem(prefix + 'apiPort', value);
    },
    setApiTimeout(state, value) {
      state.apiTimeout = value;
      LS.setItem(prefix + 'timeout', value);
    },
    setAuthIp(state, value) {
      state.authIp = value;
      LS.setItem(prefix + 'authIp', value);
    },
    setAuthPort(state, value) {
      state.authPort = value;
      LS.setItem(prefix + 'authPort', value);
    },
    setAuthTimeout(state, value) {
      state.authTimeout = value;
      LS.setItem(prefix + 'timeout', value);
    },
    setAttachmentIp(state, value) {
      state.attachmentIp = value;
      LS.setItem(prefix + 'attachmentIp', value);
    },
    setAttachmentPort(state, value) {
      state.attachmentPort = value;
      LS.setItem(prefix + 'attachmentPort', value);
    },
    setInvoiceLength(state, value) {
      state.invoiceLength = value;
      LS.setItem(prefix + 'invoiceLength', value);
    },
    setImportFileSizeLimit(state, value) {
      state.importFileSizeLimit = value;
      LS.setItem(prefix + 'importFileSizeLimit', value);
    },
    setDefaultTab(state, value) {
      state.defaultTab = value;
      LS.setItem(prefix + 'defaultTab', value);
      router.resetRoutes();
    },
    setEnableBills(state, value) {
      state.enableBills = value;
      LS.setItem(prefix + 'enableBills', value);
      router.resetRoutes();
    },
    resetState(state) {
      Object.assign(state, defaults);
    },
  },

  actions: {
    setSettings({ state, commit }, settings) {
      if (typeof settings == 'object') {
        for (const prop in settings) {
          if (defaults.hasOwnProperty(prop)) {
            if (settings[prop] != state[prop])
              commit('set' + capitalize(prop), settings[prop]);
          } else {
            console.warn('No such setting:', prop);
          }
        }
        snackbar.show('Settings have been saved');
      } else {
        console.warn('Incorrest settings object:', settings);
      }
    },

    resetSettings({ commit }) {
      for (const prop in defaults) {
        LS.removeItem(prefix + prop);
      }
      commit('resetState');
      router.resetRoutes();
      console.log('Settings have been reset');
      snackbar.show('Settings have been reset');
    },
  },
};
