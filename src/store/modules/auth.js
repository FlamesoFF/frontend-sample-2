import { LocalStorage as LS, Token } from '@apollo4u/auxiliary';
import router from '@/router';
import auth from '@/api/auth';
import attachment from '@/api/attachment';
import errorHandler from '@/utils/error-handler';
import store from '@/store';
import { getToken, getUser, getTokenValidity } from '@/utils/auth';

const token = getToken();
const tokenValid = getTokenValidity();

export default {
  namespaced: true,

  state: {
    token,
    tokenValid,
    submitting: false,
  },

  getters: {
    user: ({ token }) => getUser(),
    avatar: (state, { user }) => {
      if (user && user.avatar) return attachment.getAvatarUrl(user.avatar);
      else return 'img/no_avatar.png';
    },
    isAuthorized: ({ token }) => getTokenValidity(),
  },

  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    setTokenValidity(state, status) {
      state.tokenValid = status;
    },
    setSubmit(state, status) {
      state.submitting = status;
    },
  },

  actions: {
    updateStatus({ dispatch }) {
      const authorized = getTokenValidity();

      // logout user when token expired
      if (!authorized) dispatch('signOut');
    },
    updateUser({ commit }) {
      const user = getUser() || {};
      commit('setUser', user);
    },
    signIn({ commit }, credentials) {
      commit('setSubmit', true);
      auth
        .signIn(credentials)
        .then(res => {
          commit('setSubmit', false);
          const { token } = res.data;
          LS.setItem('token', token);
          commit('setToken', token);

          const { defaultTab } = store.state.settings;
          router.push(defaultTab);
        })
        .catch(error => {
          commit('setSubmit', false);
          errorHandler(error);
        });
    },
    signOut({ commit }) {
      LS.removeItem('token');
      commit('setToken', null);
      router.push({ name: 'auth' });
    },
  },
};
