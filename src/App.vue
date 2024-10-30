<script setup>
import { RouterView } from 'vue-router'
import BurgerMenu from './components/BurgerMenu.vue'
import { onMounted, ref } from 'vue'
import 'leaflet/dist/leaflet.css'
const menuActive = ref(false)
onMounted(() => {
  let locations = JSON.parse(localStorage.getItem('locations'))
  if (!locations) {
    locations = [
      { name: 'Mariehamn', position: { lat: 60, long: 20 }, default: true },
    ]
    localStorage.setItem('locations', JSON.stringify(locations))
  }
})
</script>

<template>
  <nav>
    <BurgerMenu @toggle-menu="menuActive = !menuActive" :active="menuActive" />
  </nav>
  <header>
    <div class="wrapper"></div>
  </header>
  <RouterView />
</template>

<style scoped>
#app {
  min-height: 100vh; /* Ensure it covers the full height */
  background-image: url('assets/images/clouds.png'); /* Path to your image */
  background-size: cover; /* Cover the entire screen */
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Avoid repeating */
  background-attachment: fixed; /* Keep background fixed when scrolling */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
