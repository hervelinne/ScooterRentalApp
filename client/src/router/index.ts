import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue')
    }, 
    {
      path: '/user',
      name: 'user',
      component: () => import('../views/auth/UserView.vue')
    }, 
    {
      path: '/scooters',
      name: 'scooters',
      component: () => import('../views/scooter/ScootersView.vue')
    },
    {
      path: '/addscooters',
      name: 'addscooters',
      component: () => import('../views/scooter/addScootersView.vue')
    },
    {
      path: '/scooter/:id',
      name: 'scooterDetails',
      component: () => import('../views/scooter/ScootersDetails.vue'),
      props: true
    },
    {
      path: '/updatescooters/:id',
      name: 'updatescooters',
      component: () => import('../views/scooter/updateScooters.vue'),
      props: true
    },
  ]
})

export default router
