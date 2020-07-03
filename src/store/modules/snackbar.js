import { toggleDevTools } from '@/utils/electron-bridge';

export default {
  namespaced: true,

  state: {
    visible: false,
    message: '',
    action: {
      label: 'OK',
      method: 'dismiss',
    },
    // method: undefined,
    duration: 5000,
    color: '',
  },

  mutations: {
    setVisibility(state, visible) {
      state.visible = visible;
    },
    setMessage(state, message) {
      state.message = message;
    },
    setDuration(state, duration) {
      state.duration = duration;
    },
    setColor(state, color) {
      state.color = color;
    },
    setAction(state, action) {
      state.action = action;
    },
  },

  actions: {
    show({ commit }, options) {
      // Options { mesasge: String, action: Action, duration: Number }
      // Actions { label: String, method: Function }
      const defaultOptions = {
        duration: 5000,
        color: '',
        action: {
          label: 'OK',
          method: 'dismiss',
        },
      };

      options = { ...defaultOptions, ...options };
      const { message, duration, action, color } = options;
      // console.log(options);

      commit('setMessage', message);
      commit('setAction', action);
      commit('setDuration', duration);
      commit('setColor', color);

      commit('setVisibility', true);
    },

    hide({ commit }) {
      commit('setVisibility', false);
    },

    action({ commit, dispatch }, actionName) {
      // if (actionName == 'dismiss') commit('setVisibility', false);
      if (actionName == 'show_results')
        dispatch('accounts/showResults', null, { root: true });
      if (actionName == 'logout')
        dispatch('auth/signOut', null, { root: true });
      if (actionName == 'open_dev_tools') toggleDevTools();
      commit('setVisibility', false);
    },
  },
};
