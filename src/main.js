import Vue from 'vue';
import Vuetify from 'vuetify';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import colors from 'vuetify/es5/util/colors';

import 'vuetify/dist/vuetify.min.css';
// import 'material-design-icons-iconfont/dist/material-design-icons.css';
// icons repo not up-to-date, use CDN

Vue.use(Vuetify, {
  theme: {
    primary: colors.blue.base,
    secondary: colors.blue.darken1,
    accent: colors.orange.base,
    error: colors.red.base,
    warning: colors.deepOrange.base,
    info: colors.cyan.base,
    success: colors.green.base,
  },
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
