import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'title',
    component: () => import('./views/TitleScreen.vue')
  },
  {
    path: '/onboarding',
    name: 'onboarding',
    component: () => import('./views/OnboardingScreen.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('./views/HomeScreen.vue')
  },
  {
    path: '/write',
    name: 'write',
    component: () => import('./views/WriteScreen.vue')
  },
  {
    path: '/release',
    name: 'release',
    component: () => import('./views/ReleaseScreen.vue')
  },
  {
    path: '/archive',
    name: 'archive',
    component: () => import('./views/ArchiveScreen.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('./views/SettingsScreen.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
