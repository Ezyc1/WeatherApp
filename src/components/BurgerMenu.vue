<script setup>
const props = defineProps(['active'])
const emits = defineEmits(['toggle-menu'])
function toggleActive() {
  emits('toggle-menu', props.active)
}
</script>

<template>
  <div id="burger" :class="{ active: props.active }" @click="toggleActive">
    <button type="button" class="burger-button" title="Menu">
      <span class="burger-bar bar--1"></span>
      <span class="burger-bar bar--2"></span>
      <span class="burger-bar bar--3"></span>
    </button>
  </div>
  <nav class="navbar" v-show="props.active">
    <RouterLink to="/">Forecasts</RouterLink>
    <RouterLink to="/current">Current</RouterLink>
    <RouterLink to="/locations">Locations</RouterLink>
  </nav>
</template>

<style scoped>
#burger {
  display: flex; /* Use flex for better alignment */
  justify-content: flex-start; /* Align items to the left */
  align-items: center; /* Center vertically */
  margin-right: 20px; /* Space from the right edge */
  position: fixed;
}

.burger-button {
  position: relative;
  height: 60px; /* Adjusted height */
  width: 30px; /* Adjusted width */
  border: 0;
  border-radius: 0;
  background-color: transparent;
  pointer-events: all;
  cursor: pointer; /* Change cursor to pointer */
  z-index: 1030;
}

.burger-bar {
  background-color: rgb(0, 189, 94);
  position: absolute;
  left: 0; /* Align to left */
  right: 0; /* Align to right */
  height: 3px;
  transition:
    transform 0.6s ease,
    opacity 0.3s ease,
    background-color 0.6s ease;
}

.bar--1 {
  transform: translateY(-8px);
}

.bar--2 {
  transform-origin: 100% 50%;
}

.bar--3 {
  transform: translateY(8px);
}

#burger.active .burger-button {
  transform: rotate(-180deg);
}

#burger.active .bar--1 {
  transform: rotate(45deg) translateY(0);
}

#burger.active .bar--2 {
  opacity: 0;
}

#burger.active .bar--3 {
  transform: rotate(-45deg) translateY(0);
}

.navbar {
  position: fixed; /* Position navbar absolutely */
  top: 60px; /* Space below burger button */
  left: 0; /* Align to the left */
  background-color: rgb(109, 108, 108); /* Background color for visibility */
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2); /* Optional shadow */
  display: flex; /* Use flex for vertical stacking */
  flex-direction: column; /* Stack links vertically */
  padding: 10px; /* Padding for navbar */
}

.navbar a {
  padding: 8px 15px; /* Padding for each link */
  text-decoration: none; /* Remove underline */
  color: #c9c9c9; /* Text color */
  font-style: bold;
}

.navbar a:hover {
  background-color: rgba(0, 189, 94, 0.1); /* Highlight on hover */
}
</style>
