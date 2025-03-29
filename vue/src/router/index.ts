import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/character',
      name: 'character',
      component: () => import('../views/Character.vue')
    },
    {
      path: '/scene',
      name: 'scene',
      component: () => import('../views/Scene.vue')
    },
    {
      path: '/storyline',
      name: 'storyline',
      component: () => import('../views/Storyline.vue')
    },
    {
      path: '/materials',
      name: 'materials',
      component: () => import('../views/Materials.vue')
    }
  ]
})

export default router