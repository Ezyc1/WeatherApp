<script setup>
import { getCurrent } from '@/services/forecastService'
import { ref, watchEffect } from 'vue'
import wc from '@/assets/data/weatherCodes.json'

// Definierar variabler för att lagra plats- och väderdata
const currentLocation = ref({})
const weather = ref({})
const loading = ref(true)
const props = defineProps(['location'])
const weatherCodes = ref(wc)

// Observerar förändringar och uppdaterar väderdata för aktuell plats
watchEffect(() => {
  loading.value = true
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

  getCurrent(currentLocation.value)
    .then(response => {
      weather.value = response
      loading.value = false
    })
    .catch(err => {
      console.log(err)
    })
})

// Hämtar textbeskrivning för väderkod från JSON-fil
function getText(code) {
  let wcText =
    weatherCodes.value.find(itm => {
      return itm.code == code
    }).description ?? 'Unknown'

  return wcText
}
</script>

<template>
  <template v-if="loading"> Laddar... </template>
  <template v-else>
    <div>
      <h2>Skapad:</h2>
      <span id="dateC">
        {{ new Date(weather.time).getDate() }}.{{
          new Date(weather.time).getMonth() + 1
        }}
        {{ weather.time.substr(weather.time.indexOf('T') + 1) }}
        (Uppdateras om
        {{ parseInt(weather.interval / 60) }}
        minuter)
      </span>
    </div>
    <ul>
      <li>
        <h1>Väder</h1>
        <ul>
          <li>{{ getText(weather.weather.code) }}</li>
          <li>
            Molnighet:
            {{ weather.weather.cloud.cover + weather.weather.cloud.unit }}
          </li>
        </ul>
      </li>
      <li>
        <h1>Temperatur</h1>
        <ul>
          <li>{{ weather.weather.temp.temp + weather.weather.temp.unit }}</li>
          <li>
            {{
              weather.weather.temp.humidity + weather.weather.temp.humidity_unit
            }}
            fuktighet
          </li>
          <li>
            Känns som
            {{ weather.weather.temp.apparent + weather.weather.temp.unit }}
          </li>
        </ul>
      </li>
      <li>
        <h1>Nederbörd</h1>
        <ul>
          <li>
            {{
              weather.weather.precipitation.precipitation +
              weather.weather.precipitation.unit
            }}
          </li>
        </ul>
      </li>
      <li>
        <h1>Vind</h1>
        <ul>
          <li>
            {{
              Math.round(weather.weather.wind.speed) + weather.weather.wind.unit
            }}
          </li>
          <li>
            {{
              weather.weather.wind.direction +
              weather.weather.wind.direction_unit
            }}
          </li>
          <li>
            Vindbyar
            {{
              Math.round(weather.weather.wind.gusts) + weather.weather.wind.unit
            }}
          </li>
        </ul>
      </li>
      <li>
        <h1>Lufttryck</h1>
        <ul>
          <li>
            {{
              weather.weather.pressure.pressure + weather.weather.pressure.unit
            }}
          </li>
        </ul>
      </li>
    </ul>
  </template>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  text-align: center;
}
#dateC {
  padding-left: 4px;
  padding-right: 4px;
  text-align: center;
}
#currentList {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  color: #333;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1em;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 1em;
}

.header {
  font-weight: bold;
  font-size: 1.5em;
  text-align: center;
  color: #007bff;
  margin-bottom: 0.5em;
}

ul {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin: 1em 0;
  padding: 0;
}

li {
  padding: 0.8em;
  list-style: none;
  border: 1px solid;
  border-radius: 4px;
  margin-bottom: 0.5em;
  transition: background-color 0.3s;
}

li span {
  font-weight: bold;
}

@media (max-width: 768px) {
  #currentList,
  ul {
    grid-template-columns: repeat(2, 1fr);
  }

  .header {
    font-size: 1.5em;
  }

  li {
    font-size: 1em;
  }
}

@media (max-width: 480px) {
  #currentList,
  ul {
    grid-template-columns: 1fr;
  }

  .header {
    font-size: 1.2em;
  }

  li {
    font-size: 0.9em;
  }
}

#forecastData {
  border: 1px solid #ccc;
  text-align: center;
  vertical-align: middle;
}
.ulData {
  text-align: center;
}
</style>
