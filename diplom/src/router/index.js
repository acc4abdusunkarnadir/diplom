import { createRouter, createWebHistory } from 'vue-router';

import QuizPage from '@/components/QuizPage.vue';
import MainContent from '@/components/QuizResult.vue';
import SignIn from '@/components/SignIn.vue';
import SignUp from '@/components/SignUp.vue';
import Listening from '../components/Listening.vue';
import WordGame from '@/components/WordGame.vue'; // Import the WordGame component
import KazakhAdventure from '@/components/KazakhAdventure.vue'; // Add this import

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainContent,
    },
    {
      path: '/listening',
      name: 'Listening',
      component: Listening,
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
    {
      path: '/wordgame',
      name: 'WordGame',
      component: WordGame,
    },
    {
      path: '/adventure',
      name: 'KazakhAdventure',
      component: KazakhAdventure,
    },
  ],
});

export default router;