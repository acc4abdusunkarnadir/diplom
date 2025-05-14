import { createRouter, createWebHistory } from 'vue-router';

import QuizPage from '@/components/QuizPage.vue';
import SignIn from '@/components/SignIn.vue';
import SignUp from '@/components/SignUp.vue';
import Listening from '@/components/Listening.vue';
import WordGame from '@/components/WordGame.vue';
import KazakhAdventure from '@/components/KazakhAdventure.vue';
import LearningSystem from '@/components/LearningSystem.vue';
import MainContent from '@/components/QuizResult.vue';
import KazakhCompetitive from '@/components/KazakhCompetitive.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
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
      component: () => import('@/views/WordCreation.vue'),
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
    {
      path: '/learning',
      name: 'Learning',
      component: LearningSystem,
    },
    {
      path: '/competitive',
      name: 'KazakhCompetitive',
      component: KazakhCompetitive,
    },
  ],
});

export default router;