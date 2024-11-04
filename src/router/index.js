import ForecastView from '@/views/ForecastView.vue'
import CurrentView from '@/views/CurrentView.vue'
import LocationsView from '@/views/LocationsView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: [
    {
      path: '/~60926/vader',
      name: 'home',
      component: CurrentView,
    },
    {
      path: '/~60926/vader/forecast/:location',
      name: 'forecast',
      component: ForecastView,
    },
    {
      path: '/~60926/vader/locations',
      name: 'Locations',
      component: LocationsView,
    },
    {
      path: '/~60926/vader/current',
      name: 'Current Weather',
      component: CurrentView,
      props: true,
    },
  ],
})

export default router
