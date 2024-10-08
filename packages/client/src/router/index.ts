import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ModelingView from '@/views/ModelingView.vue'
import ErdView from '@/views/ErdView.vue'
import DBView from '@/views/DBView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/db',
      name: 'db',
      component: DBView
    },
    {
      path: '/modeling',
      name: 'modeling',
      component: ModelingView
    },
    {
      path: '/erd',
      name: 'erd',
      component: ErdView
    },
  ]
})

export default router
