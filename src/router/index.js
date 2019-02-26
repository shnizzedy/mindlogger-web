import Vue from 'vue';
import Router from 'vue-router';
import TakeSurvey from '@/components/TakeSurvey';
import Login from '@/components/Login/';
import SignUp from '@/components/SignUp/';
import Applet from '@/components/Applet';
import AppletParentRoute from '@/components/AppletParentRoute';
import AllApplets from '@/components/AllApplets';
import config from '../config';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'AllApplets',
      component: AllApplets,
    },
    {
      path: '/applet',
      name: 'AppletParentRoute',
      component: AppletParentRoute,
      children: [
        {
          name: 'Applet',
          path: '/applet/:appletId',
          component: Applet,
        },
        {
          path: '/survey/:surveyId',
          name: 'TakeSurvey',
          component: TakeSurvey,
        },
      ],
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      props: {
        apiHost: config.apiHost,
        signupLink: '/signup',
      },
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp,
      props: {
        apiHost: config.apiHost,
        loginLink: '/login',
      },
    },
  ],
});

// router.beforeEach((to, from, next) => {
//   // ...
// });

export default router;
