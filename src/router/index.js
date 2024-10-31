import ForecastView from '@/views/ForecastView.vue'
import CurrentView from '@/views/CurrentView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: CurrentView,
    },
    {
      path: '/forecast/:location',
      name: 'forecast',
      component: ForecastView,
    },
    {
      path: '/locations',
      name: 'Locations',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/LocationsView.vue'),
    },
    {
      path: '/current',
      name: 'Current Weather',
      component: CurrentView,
      props: true,
    },
  ],
})

export default router
