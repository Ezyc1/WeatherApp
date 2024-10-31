<script setup>
import { getCurrent } from '@/services/forecastService'
import { ref, watchEffect } from 'vue'
import wc from '@/assets/data/weatherCodes.json'

const currentLocation = ref({})
const weather = ref({})
const loading = ref(true)
const props = defineProps(['location'])
const weatherCodes = ref(wc)

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

function getText(code) {
  let wcText =
    weatherCodes.value.find(itm => {
      return itm.code == code
    }).description ?? 'Unknown'

  return wcText
}
</script>
<template>
  <template v-if="loading"> loading... </template>
  <template v-else>
    <div>
      <h2>Created:</h2>
      <span id="dateC"
        >{{ new Date(weather.time).getDate() }}.{{
          new Date(weather.time).getMonth() + 1
        }}
        {{ weather.time.substr(weather.time.indexOf('T') + 1) }}

        (Updated in
        {{ parseInt(weather.interval / 60) }}
        minutes)
      </span>
    </div>
    <ul>
      <li>
        <h1>Weather</h1>
        <ul>
          <li>{{ getText(weather.weather.code) }}</li>
          <li>
            Overcast:
            {{ weather.weather.cloud.cover + weather.weather.cloud.unit }}
          </li>
        </ul>
      </li>
      <li>
        <h1>Temp</h1>
        <ul>
          <li>{{ weather.weather.temp.temp + weather.weather.temp.unit }}</li>
          <li>
            {{
              weather.weather.temp.humidity + weather.weather.temp.humidity_unit
            }}
            humudity
          </li>
          <li>
            Feels like
            {{ weather.weather.temp.apparent + weather.weather.temp.unit }}
          </li>
        </ul>
      </li>
      <li>
        <h1>Precip</h1>
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
        <h1>Wind</h1>
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
            Gusts
            {{
              Math.round(weather.weather.wind.gusts) + weather.weather.wind.unit
            }}
          </li>
        </ul>
      </li>
      <li>
        <h1>Pressure</h1>
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
  grid-template-columns: repeat(3, 1fr); /* Four equal columns */
  color: #333; /* Darker text for better readability */
  border: 1px solid #ccc; /* Border for the list */
  border-radius: 8px; /* Rounded corners */

  padding: 1em; /* Padding for the list */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
  margin-bottom: 1em; /* Space below the header */
}

.header {
  font-weight: bold;
  font-size: 1.5em; /* Larger font size for headers */
  text-align: center; /* Center the header text */
  color: #007bff; /* Blue color for headers */
  margin-bottom: 0.5em; /* Space below header */
}

ul {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Match the layout of the header */
  margin: 1em 0; /* Vertical space around the list */
  padding: 0; /* Remove padding */
}

li {
  padding: 0.8em; /* Consistent padding */
  list-style: none;
  border: 1px solid; /* Border for list items */
  border-radius: 4px; /* Rounded corners for list items */
  margin-bottom: 0.5em; /* Space between list items */
  transition: background-color 0.3s; /* Smooth transition for hover */
}

li span {
  font-weight: bold; /* Emphasize the labels */
}

@media (max-width: 768px) {
  #currentList,
  ul {
    grid-template-columns: repeat(2, 1fr); /* Two columns on smaller screens */
  }

  .header {
    font-size: 1.5em; /* Larger header font on smaller screens */
  }

  li {
    font-size: 1em; /* Medium font size for list items */
  }
}

@media (max-width: 480px) {
  #currentList,
  ul {
    grid-template-columns: 1fr; /* Single column on mobile */
  }

  .header {
    font-size: 1.2em; /* Slightly larger header font for mobile */
  }

  li {
    font-size: 0.9em; /* Smaller font size for list items */
  }
}

#forecastData {
  border: 1px solid #ccc; /* Border for forecast data */
  text-align: center; /* Center text */
  vertical-align: middle; /* Align items vertically */
}
.ulData {
  text-align: center;
}
</style>
