import Vue from 'vue';
import Router from 'vue-router';
import TakeSurvey from '@/components/TakeSurvey';
import Login from '@/components/Login/';
import SignUp from '@/components/SignUp/';
import Profile from '@/components/Profile';
import Landing from '@/components/Landing';
import Applet from '@/components/Applet';
import AppletParentRoute from '@/components/AppletParentRoute';
import AllApplets from '@/components/AllApplets';
import Consent from '@/components/Consent';
import config from '../config';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/allapplets',
      name: 'AllApplets',
      component: AllApplets,
    },
    {
      path: '/',
      name: 'Landing',
      component: Landing,
    },
    {
      path: '/consent/:inviteURL',
      name: 'Consent',
      component: Consent,
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
          path: '/applet/:appletId/survey/:surveyId',
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
        signupLink: { name: 'SignUp' },
      },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp,
      props: {
        apiHost: config.apiHost,
        loginLink: { name: 'Login' },
      },
    },
  ],
});

// router.beforeEach((to, from, next) => {
//   // ...
// });

export default router;
