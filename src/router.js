import Vue from 'vue';
import Router from 'vue-router';

import getRoutes from '@/routes';

Vue.use(Router);

const createRouter = () => {
  const routes = getRoutes();
  return new Router({ routes });
};

const router = createRouter();

router.resetRoutes = function() {
  this.matcher = createRouter().matcher;
  console.log('Routes have been reset');
};

export default router;

// router.beforeEach((to, from, next) => {
//   console.log('beforeEach triggered');
//   // Auth guard
//   const tokenValid = getTokenValidity();

//   if (tokenValid) {
//     console.log('Case: Token valid.');
//     if (to.name == 'auth') {
//       if (!from.name) {
//         // just opened the page
//         next({ path: '/' });
//       } else {
//         next(false);
//         snackbar.warn('You are already signed in');
//       }
//     } else {
//       // going anywhere but auth
//       next();
//     }
//   } else {
//     // token invalid
//     console.log('Case: Token invalid.');
//     if (to.name == 'auth' || to.name == 'settings') {
//       console.log('Case: Going to', to.name + ', proceed.');
//       next();
//     } else {
//       // going anywhere but auth & settings
//       console.log('Case: Not going to auth or settings.');
//       if (from.name == 'auth') {
//         console.log('Case: Coming from auth, stop.');
//         next(false);
//         snackbar.show(`You are not authorized`);
//       } else {
//         // next({ name: 'auth' });
//         store.dispatch('auth/updateStatus');
//         snackbar.show(`Session expired`);
//       }
//     }
//   }
// });
