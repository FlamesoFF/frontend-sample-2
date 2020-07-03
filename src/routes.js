import Allocator from '@/views/Allocator.vue';
import Payments from '@/views/Payments.vue';
import Bills from '@/views/Bills.vue';
import Auth from '@/views/Auth.vue';
import Settings from '@/views/Settings.vue';
import store from '@/store';
import { getTokenValidity } from '@/utils/auth';
import snackbar from '@/utils/snackbar';

// prettier-ignore
const getRoutes = () => {
  
  const { authorized, redirect } = guards;
  const routes = [
    // { path: '/', redirect: '/' + defaultTab },
    { path: '/', redirect: '/sign-in' },
    { path: '/allocator', name: 'allocator', component: Allocator, beforeEnter: authorized },
    { path: '/payments' , name: 'payments' , component: Payments , beforeEnter: authorized },
    { path: '/sign-in'  , name: 'auth'     , component: Auth     , beforeEnter: redirect },
    { path: '/settings' , name: 'settings' , component: Settings , },
  ];

  // conditional routes
  const { enableBills } = store.state.settings;

  if (enableBills) routes.push(
    { path: '/bills', name: 'bills', component: Bills, beforeEnter: authorized }
  );
  else routes.push({ path: '/bills', redirect: '/sign-in' });

  return routes;
};

const guards = {
  authorized(to, from, next) {
    const tokenValid = getTokenValidity();
    if (!tokenValid) {
      if (from.name == 'auth') {
        next(false);
        snackbar.show(`You are not authorized`);
      } else {
        store.dispatch('auth/updateStatus');
        snackbar.show(`Session expired`);
      }
    } else next();
  },

  redirect(to, from, next) {
    const { defaultTab } = store.state.settings;
    const tokenValid = getTokenValidity();
    if (tokenValid) next({ name: defaultTab });
    else next();
  },
};

export default getRoutes;
