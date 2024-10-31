<script setup>
import ForecastResult from '@/components/ForecastResult.vue'
import { getForecast } from '@/services/forecastService'
import { ref, watchEffect } from 'vue'

const currentLocation = ref({
  lat: 60.0,
  long: 20.0,
  name: 'Nuvarande position',
})
const info = ref({})
const props = defineProps(['location'])
watchEffect(() => {
  let locationsList = JSON.parse(localStorage.getItem('locations'))
  if (props.location) {
    currentLocation.value = locationsList.find(loc => {
      return loc.name.toLocaleLowerCase() === props.location.toLocaleLowerCase()
    })
  } else {
    currentLocation.value = locationsList.find(loc => {
      return loc.default
    })
  }
  // Hämta väderdata endast om det finns en giltig plats
  if (currentLocation.value) {
    getForecast(currentLocation.value)
      .then(response => {
        info.value = response
      })
      .catch(err => {
        console.log(err)
      })
  }
})
</script>
<template>
  <template v-if="!currentLocation">
    <h2>Angiven plats finns inte</h2>
    <p>{{ props.location }} finns inte i listan över platser</p>
  </template>
  <template v-else>
    <div id="currentLocation">
      <h2>{{ currentLocation.name }}</h2>
      <p class="location">
        Lat: <span>{{ currentLocation.position.lat.toFixed(3) }}</span>
      </p>
      <p class="location">
        Long: <span> {{ currentLocation.position.long.toFixed(3) }}</span>
      </p>
    </div>
    <br />
    <h3 id="forecasts">Forecasts</h3>
    <br />
    <ForecastResult :forecast="info" />
  </template>
</template>
<style scoped>
.location {
  display: inline-block;
  margin: 0 1em;
}
#currentLocation {
  border: 2px;
  border-style: solid;
  text-align: center;
  text-shadow: 1px 1px 1px black;
  color: whitesmoke;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  background-color: rgba(0, 0, 0, 0.514);
}
#forecasts {
  border: 2px;
  border-style: solid;
  text-align: center;
  background-color: whitesmoke;
  font-size: 200%;
  text-shadow: 1px 1px 1px black;
  color: whitesmoke;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  background-color: rgba(0, 0, 0, 0.514);
}
</style>
