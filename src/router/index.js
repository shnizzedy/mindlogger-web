import Vue from 'vue';
import Router from 'vue-router';
import TakeSurvey from '@/components/TakeSurvey';
import Login from '@/components/Login/';
import config from '../config';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'TakeSurvey',
      component: TakeSurvey,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      props: {
        apiHost: config.apiHost,
      },
    },
  ],
});

// router.beforeEach((to, from, next) => {
//   // ...
// });

export default router;
