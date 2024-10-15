<script setup>
const props = defineProps(['forecast'])
</script>

<template>
  <ul>
    <li>Date</li>
    <li>Code</li>
    <li>Temp</li>
    <li>Precip</li>
    <li>Wind</li>
  </ul>
  <ul v-for="day in props.forecast.weather" :key="day">
    <li>{{ day.date }}</li>
    <li>{{ day.code }}</li>
    <li>{{ day.temp }}</li>
    <li>{{ day.precipitation }}</li>
    <li>{{ day.wind }}</li>
  </ul>
</template>

<style scoped>
ul {
  padding: 0;
}
ul:nth-child(even){
  background-color: rgb(73, 73, 73);
}
ul:nth-child(odd){
  background-color: rgb(107, 106, 106);
}
li {
  padding: 0 .5em;
  list-style-type: none;
  display: inline-block;
}
</style>
