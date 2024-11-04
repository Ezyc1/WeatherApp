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

// Tar emot platsnamn som prop
const props = defineProps(['location'])

// Uppdaterar aktuell plats och hämtar väderdata
watchEffect(() => {
  let locationsList = JSON.parse(localStorage.getItem('locations'))

  // Om en specifik plats är angiven, hitta den i listan
  if (props.location) {
    currentLocation.value = locationsList.find(loc => {
      return loc.name.toLocaleLowerCase() === props.location.toLocaleLowerCase()
    })
  } else {
    // Om ingen plats angiven, använd standardplatsen
    currentLocation.value = locationsList.find(loc => loc.default)
  }

  // Hämtar väderdata endast om platsen finns
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
  <!-- Om platsen inte finns, visa meddelande -->
  <template v-if="!currentLocation">
    <h2>Angiven plats finns inte</h2>
    <p>{{ props.location }} finns inte i listan över platser</p>
  </template>
  <template v-else>
    <!-- Visar information om den aktuella platsen -->
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
    <!-- Visar väderinformation med hjälp av CurrentResult-komponenten -->
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
  border: 2px solid;
  padding-top: 2px;
  padding-left: 2px;
  padding-right: 2px;
  text-shadow: 1px 1px 1px black;
  color: whitesmoke;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  background-color: rgba(0, 0, 0, 0.514);
}
#currentLocation {
  border: 2px solid;
  text-align: center;
  text-shadow: 1px 1px 1px black;
  color: whitesmoke;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  background-color: rgba(0, 0, 0, 0.514);
}
#cWeather {
  border: 2px solid;
  text-align: center;
  font-size: 200%;
}
</style>
