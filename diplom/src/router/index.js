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
import LevelSelection from '../components/LevelSelection.vue';
import GrammarChecker from '@/components/GrammarChecker.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: MainContent,
      meta: { requiresAuth: true }
    },
    {
      path: '/listening',
      name: 'Listening',
      component: Listening,
      meta: { requiresAuth: true, minLevel: 'B1' }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/WordCreation.vue'),
      meta: { requiresAuth: true, minLevel: 'B1' }
    },
    {
      path: '/courses',
      name: 'courses',
      component: QuizPage,
      meta: { requiresAuth: true }
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
      meta: { requiresAuth: true, minLevel: 'B1' }
    },
    {
      path: '/adventure',
      name: 'KazakhAdventure',
      component: KazakhAdventure,
      meta: { requiresAuth: true, minLevel: 'B1' }
    },
    {
      path: '/learning',
      name: 'Learning',
      component: LearningSystem,
      meta: { requiresAuth: true, requiresLevel: true },
    },
    {
      path: '/competitive',
      name: 'KazakhCompetitive',
      component: KazakhCompetitive,
      meta: { requiresAuth: true, minLevel: 'B1' }
    },
    {
      path: '/level-selection',
      name: 'level-selection',
      component: LevelSelection,
      meta: { requiresAuth: true },
    },
    {
      path: '/grammar-check',
      name: 'GrammarChecker',
      component: GrammarChecker,
      meta: { requiresAuth: true }
    },
  ],
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userLevel = localStorage.getItem("userLevel");

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/signin");
  } else if (to.meta.requiresLevel && !userLevel) {
    next("/level-selection");
  } else if (to.meta.minLevel && userLevel) {
    // Define level hierarchy
    const levelHierarchy = {
      'A1': 1,
      'A2': 2,
      'B1': 3,
      'B2': 4,
      'C1': 5,
      'C2': 6
    };

    const requiredLevel = levelHierarchy[to.meta.minLevel];
    const userLevelValue = levelHierarchy[userLevel];

    if (userLevelValue < requiredLevel) {
      next("/learning"); // Redirect to learning system if level is too low
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;