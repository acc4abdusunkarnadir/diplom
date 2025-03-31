import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import QuizPage from '@/components/QuizPage.vue'
import MainContent from '@/components/MainContent.vue'

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
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/courses',
      name: 'courses',
      component: QuizPage, // Add QuizPage component for this route
    },
  ],
})

export default router
