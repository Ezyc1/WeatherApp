<script setup>
import wc from '@/assets/data/weatherCodes.json'
import { ref } from 'vue'

const props = defineProps(['forecast']) // Inkommande prop för väderdata
const weatherCodes = ref(wc) // Referens till JSON-fil med väderkoder och beskrivningar

function getText(code) {
  // Funktion för att hämta väderbeskrivning baserat på "Weathercode"
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
        <!-- Hämtar väderbeskrivning för dagens kod -->
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
  grid-template-columns: repeat(4, 1fr); /* Fyra lika kolumner */
  color: white;
  border-radius: 4px;
  margin-bottom: 1em;
  text-align: center;
}

ul {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-bottom: 0.5em;
  background-color: whitesmoke;
}

li {
  padding: 0.5em;
  list-style-type: none;
  vertical-align: top;
}

@media (max-width: 768px) {
  #forecastList,
  ul {
    grid-template-columns: repeat(2, 1fr); /* Två kolumner på mindre skärmar */
  }

  .header {
    font-size: larger;
  }

  li {
    font-size: medium;
  }
}

@media (max-width: 480px) {
  #forecastList,
  ul {
    grid-template-columns: 1fr; /* En kolumn på mobilskärmar */
  }

  .header {
    font-size: large;
  }

  li {
    font-size: small;
  }
}

#forecastData {
  border: 1px solid;
  text-align: center;
  vertical-align: middle;
  text-shadow: 1px 1px 1px black;
  color: whitesmoke;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  background-color: rgba(0, 0, 0, 0.514);
}

#dateOvercast {
  border: 1px dashed;
  font-size: 20px;
}
</style>
