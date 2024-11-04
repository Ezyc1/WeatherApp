<script setup>
import router from '@/router'
import { getPosition } from '@/services/positioningService'
import { onMounted, ref, computed } from 'vue'
import LeafletMap from '@/components/LeafletMap.vue'

const location = ref({
  name: '',
  position: { lat: 0, long: 0 },
  default: false,
})
const locationsList = ref([])
const errorMessage = ref('')

// Hämta standardplatsen från listan
const defaultLocation = computed(() => {
  return locationsList.value.find(loc => loc.default)
})

onMounted(() => {
  // Hämta och visa lagrade platser från localStorage
  locationsList.value = JSON.parse(localStorage.getItem('locations')) || []

  let current = locationsList.value.find(loc => loc.name === 'Current location')
  if (!current) {
    // Skapa en ny plats om "Current location" saknas
    current = {
      name: 'Current location',
      position: { lat: 0, long: 0 },
      default: false,
    }
    locationsList.value.unshift(current)
  }

  // Hämta användarens aktuella position
  getPosition()
    .then(response => {
      current.position = response.position
      let index = locationsList.value.findIndex(
        loc => loc.name === 'Current location',
      )
      locationsList.value.splice(index, 1, current)
      localStorage.setItem('locations', JSON.stringify(locationsList.value))
    })
    .catch(err => {
      let index = locationsList.value.findIndex(
        loc => loc.name === 'Current location',
      )
      locationsList.value.splice(index, 1)
      console.log(err)
    })
})

// Spara ny plats i listan och i localStorage
function saveLocation() {
  if (!location.value.name.trim()) {
    errorMessage.value = 'Location name is invalid'
    return
  }
  errorMessage.value = ''

  let locations = locationsList.value.filter(loc => {
    return (
      loc.name.toLowerCase().trim() !== location.value.name.toLowerCase().trim()
    )
  })
  locations.push(location.value)
  locationsList.value = locations
  setLocation(location.value, false)
  resetLocation()
  localStorage.setItem('locations', JSON.stringify(locationsList.value))
}

// Återställ platsens namn och koordinater
function resetLocation() {
  location.value = { name: '', position: { lat: 0, long: 0 }, default: false }
}

// Ta bort vald plats och uppdatera listan
function removeLocation(loc) {
  locationsList.value = locationsList.value.filter(location => location !== loc)
  if (loc.default && locationsList.value.length > 0) {
    locationsList.value[0].default = true
  }
  localStorage.setItem('locations', JSON.stringify(locationsList.value))
}

// Sätt vald plats som standard och navigera till platsen
function setLocation(loc, navigate) {
  if (locationsList.value.indexOf(loc) === -1) {
    return
  }
  locationsList.value.forEach(itm => {
    itm.default = itm === loc
  })
  localStorage.setItem('locations', JSON.stringify(locationsList.value))
  if (navigate) {
    router.push(`/~60926/vader/forecast/${loc.name}`)
  }
}
</script>

<template>
  <div id="tempCss">
    <h2 id="locTitle">Locations</h2>
    <label>
      Name:
      <input type="text" v-model="location.name" placeholder="Location name" />
    </label>
    <span v-if="errorMessage" class="error">{{ errorMessage }}</span>

    <label>
      Lat:
      <input
        type="number"
        max="90"
        min="-90"
        step=".1"
        size="5"
        v-model="location.position.lat"
      />
    </label>
    <label>
      Long:
      <input
        type="number"
        max="180"
        min="-180"
        step=".1"
        size="6"
        v-model="location.position.long"
      />
    </label>
    <button @click="saveLocation">Save</button>
    <button @click="resetLocation">Reset</button>

    <hr />
    <h3 id="listTitle">List</h3>
    <ul>
      <li
        v-for="loc in locationsList"
        :key="loc.name"
        :class="loc.default ? 'default' : ''"
        @click="setLocation(loc, true)"
      >
        {{ loc.name }}
        ({{ Math.abs(loc.position?.lat ?? 0).toFixed(2) }}°{{
          loc.position?.lat > 0 ? 'N' : 'S'
        }}
        {{ Math.abs(loc.position?.long ?? 0).toFixed(2) }}°{{
          loc.position?.long > 0 ? 'E' : 'W'
        }})
        <span
          class="remove"
          @click="removeLocation(loc)"
          v-show="loc.name !== 'Current location'"
          >x</span
        >
      </li>
    </ul>
    <div id="leafletMap" v-if="defaultLocation">
      <LeafletMap :centerPosition="defaultLocation.position"></LeafletMap>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  text-align: center;
}

#tempCss {
  text-shadow: 1px 1px 1px black;
  color: whitesmoke;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  background-color: rgba(0, 0, 0, 0.514);
  padding: 1em;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
}

#locTitle,
#listTitle {
  font-size: 1.5em;
  margin-bottom: 0.5em;
}

label {
  display: block;
  width: 100%;
  margin: 1em 0;
  font-size: 1em;
}

input[type='text'],
input[type='number'] {
  width: 100%;
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
  margin-bottom: 0.5em;
}

input[type='text']:focus,
input[type='number']:focus {
  border-color: #000000;
  border-style: dashed;
  outline: none;
  border-width: 2px;
}

button {
  background-color: rgba(0, 0, 0, 0.514);
  border: none;
  border-radius: 4px;
  padding: 0.5em 1em;
  cursor: pointer;
  font-size: 1em;
  margin-right: 0.5em;
  transition: background-color 0.3s;
  text-shadow: 1px 1px 1px black;
  color: whitesmoke;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

button:hover {
  background-color: #ffffff2d;
}

ul {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 0;
  gap: 0.5em;
  margin: 1em 0;
}

li {
  padding: 0.8em;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.514);
  transition: background-color 0.3s;
}

li.default {
  font-weight: bold italic;
  background-color: rgba(173, 216, 230, 0.479);
}

li:hover {
  background-color: #ffffff2d;
}

.remove {
  color: #fff;
  background-color: #dc3545;
  padding: 0.3em 0.6em;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.remove:hover {
  background-color: #c82333;
}

.error {
  color: #dc3545;
  font-size: 0.9em;
  margin-top: 0.5em;
}

@media (max-width: 768px) {
  ul {
    grid-template-columns: repeat(2, 1fr);
  }

  #locTitle,
  #listTitle {
    font-size: 1.3em;
  }
}

@media (max-width: 480px) {
  ul {
    grid-template-columns: 1fr;
  }

  #locTitle,
  #listTitle {
    font-size: 1.1em;
  }
}
#listTitle,
#locTitle {
  font-size: 30px;
}
</style>
