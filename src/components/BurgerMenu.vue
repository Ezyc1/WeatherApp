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
    <RouterLink to="/~60926/vader/">Current</RouterLink>
    <RouterLink to="/~60926/vader/forecast/:location">Forecasts</RouterLink>
    <RouterLink to="/~60926/vader/locations">Locations</RouterLink>
  </nav>
</template>

<style scoped>
#burger {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-right: 20px;
  position: fixed;
}

.burger-button {
  position: relative;
  height: 60px;
  width: 30px;
  border: 0;
  border-radius: 0;
  background-color: transparent;
  pointer-events: all;
  cursor: pointer;
  z-index: 1030;
}

.burger-bar {
  background-color: lightblue;
  position: absolute;
  left: 0;
  right: 0;
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
  position: fixed;
  top: 60px;
  left: 0;
  background-color: whitesmoke;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  padding: 10px;
  border: 2px;
  border-style: solid;
}

.navbar a {
  padding: 8px 15px;
  text-decoration: none;
  color: black;
  font-style: bold;
}

.navbar a:hover {
  background-color: rgba(0, 189, 94, 0.1);
}
</style>
