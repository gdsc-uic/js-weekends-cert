import { store } from './store';
import { version } from '../package.json';

// router
import { createRouter, createWebHistory } from 'vue-router';
import { analytics } from './firebase';
const routes = [
  { 
    path: '/', 
    component: () => import('./pages/Home.vue'),
    meta: {
      transition: 'fade',
      pageTitle: 'Home Page'
    }
  },
  { 
    path: '/confirm', 
    component: () => import('./pages/ConfirmAuth.vue'),
    meta: {
      pageTitle: 'Auth Confirmation'
    },
    beforeEnter: (to, from, next) => {
      if (to.path == '/confirm' && !to.query.hasOwnProperty('apiKey') && !to.query.hasOwnProperty('oobCode')) {
        next('/');
      } else {
        next();
      }
    }
  },
  {
    path: '/cert',
    component: () => import('./pages/CertificateScreen.vue'),
    meta: {
      transition: 'fade',
      requiresAuth: true,
      pageTitle: 'Certificate Screen'
    }
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth && !(await store.dispatch('getCurrentUser'))) {
    next('/');
  } else {
    if (import.meta.env.PROD) {
      analytics.setCurrentScreen(to.meta.pageTitle);
      analytics.logEvent("page_view");
      analytics.logEvent("screen_view", {
        app_name: 'web',
        screen_name: to.meta.pageTitle,
        app_version: version
      });
    }
    next();
  }
});

router.afterEach((to, from) => {
  if (!from) {
    to.meta.transitionName = '';
  }
});