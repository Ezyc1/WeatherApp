<script setup>
import wc from '@/assets/data/weatherCodes.json'
import { ref } from 'vue'
const props = defineProps(['forecast'])
const weatherCodes = ref(wc)

function getText(code) {
  let wcText =
    weatherCodes.value.find(itm => {
      return itm.code == code
    })?.description ?? 'Unknown'

  return wcText
}
</script>

<template>
  <ul v-for="day in props.forecast.weather" :key="day.date" id="forecastData">
    <li>
      <p id="dateOvercast">
        Date: {{ new Date(day.date).getDate() }}.{{
          new Date(day.date).getMonth() + 1
        }}
        {{ getText(day.code) }}
      </p>
    </li>
    <li>
      Temp: {{ day.temp.min }}{{ day.temp.unit }} - {{ day.temp.max
      }}{{ day.temp.unit }}
    </li>
    <li>
      Precip: {{ day.precipitation.sum }}{{ day.precipitation.unit }} ({{
        day.precipitation.probability
      }}%)
    </li>
    <li>
      Gusts: {{ Math.round(day.wind.speed) }} ({{
        Math.round(day.wind.gusts)
      }}){{ day.wind.unit }} {{ day.wind.direction
      }}{{ day.wind.direction_unit }}
    </li>
  </ul>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#forecastList {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Four equal columns */
  color: white; /* Header text color */
  border-radius: 4px;
  margin-bottom: 1em; /* Space below the header */
  text-align: center;
}

.header {
  font-weight: bold;
  padding: 1em; /* Padding for header items */
  text-align: center; /* Center the header text */
}

ul {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Match the layout of the header */
  margin-bottom: 0.5em; /* Space between forecast entries */
  background-color: whitesmoke;
}

li {
  padding: 0.5em; /* Consistent padding */
  list-style-type: none;
  vertical-align: top;
}

@media (max-width: 768px) {
  #forecastList,
  ul {
    grid-template-columns: repeat(2, 1fr); /* Two columns on smaller screens */
  }

  .header {
    font-size: larger; /* Larger header font on smaller screens */
  }

  li {
    font-size: medium; /* Medium font size for list items */
  }
}

@media (max-width: 480px) {
  #forecastList,
  ul {
    grid-template-columns: 1fr; /* Single column on mobile */
  }

  .header {
    font-size: large; /* Larger header font for mobile */
  }

  li {
    font-size: small; /* Smaller font size for list items */
  }
}
#forecastData {
  border: 1px;
  border-style: solid !important;
  text-align: center;
  vertical-align: middle;
}
#dateOvercast {
  border: 1px;
  border-style: dashed;
  font-size: 20px;
}
</style>
