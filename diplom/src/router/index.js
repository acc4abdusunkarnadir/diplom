import { createRouter, createWebHistory } from 'vue-router';

import QuizPage from '@/components/QuizPage.vue';
import MainContent from '@/components/QuizResult.vue';
import SignIn from '@/components/SignIn.vue';
import SignUp from '@/components/SignUp.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainContent,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/WordCreation.vue'),
    },
    {
      path: '/courses',
      name: 'courses',
      component: QuizPage,
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('isAuthenticated') === 'true') {
          next();
        } else {
          next('/signin');
        }
      },
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignIn,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp,
    },
  ],
});

export default router;