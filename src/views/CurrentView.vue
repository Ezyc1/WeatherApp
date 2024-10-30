<script setup>
import CurrentResult from '@/components/CurrentResult.vue'
import { getForecast } from '@/services/forecastService.js'
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
    <div id="resultDiv">
      <h3 id="cWeather">Current weather</h3>
      <CurrentResult :location="props.location" />
    </div>
  </template>
</template>
<style scoped>
.location {
  display: inline-block;
  margin: 0 1em;
}
#resultDiv {
  border: 2px;
  border-style: solid;
  padding-top: 2px;
  padding-left: 2px;
  padding-right: 2px;
  background-color: whitesmoke;
}
#currentLocation {
  border: 2px;
  border-style: solid;
  text-align: center;
}
#cWeather {
  border: 2px;
  border-style: solid;
  text-align: center;
  font-size: 200%;
}
</style>
