<script setup>
import router from '@/router'
import { getPosition } from '@/services/positioningService'
import { onMounted, ref } from 'vue'

const location = ref({
  name: '',
  position: { lat: 0, long: 0 },
  default: false,
})
const locationsList = ref([])
const errorMessage = ref('') // Add an error message ref

onMounted(() => {
  locationsList.value = JSON.parse(localStorage.getItem('locations')) || []

  let current = locationsList.value.find(loc => {
    return (loc.name = 'Current location')
  })
  if (!current) {
    current = {
      name: 'Current location',
      position: { lat: 0, long: 0 },
      default: false,
    }
    locationsList.value.unshift(current)
  }

  getPosition()
    .then(response => {
      current.position = response.position
      let index = locationsList.value.findIndex(loc => {
        return loc.name === 'Current location'
      })
      locationsList.value.splice(index, 1, current)
      localStorage.setItem('locations', JSON.stringify(locationsList.value))
    })
    .catch(err => {
      let index = locationsList.value.findIndex(loc => {
        return loc.name === 'Current location'
      })
      locationsList.value.splice(index, 1)
      console.log(err)
    })
})

function saveLocation() {
  if (!location.value.name.trim()) {
    errorMessage.value = 'Location name is invalid' // Set error message
    return // Stop the function execution
  }

  errorMessage.value = '' // Clear any previous error messages

  let locations = locationsList.value.filter(loc => {
    return (
      loc.name.toLocaleLowerCase().trim() !=
      location.value.name.toLocaleLowerCase().trim()
    )
  })
  locations.push(location.value)
  locationsList.value = locations
  setLocation(location.value, false)
  resetLocation()
  localStorage.setItem('locations', JSON.stringify(locationsList.value))
}

function resetLocation() {
  location.value = { name: '', position: { lat: 0, long: 0 }, default: false }
}

function removeLocation(loc) {
  locationsList.value = locationsList.value.filter(location => {
    return location !== loc
  })
  if (loc.default && locationsList.value.length > 0) {
    locationsList.value[0].default = true
  }
  localStorage.setItem('locations', JSON.stringify(locationsList.value))
}

function setLocation(loc, navigate) {
  if (locationsList.value.indexOf(loc) === -1) {
    return
  }
  locationsList.value.map(itm => {
    itm.default = itm === loc
  })
  localStorage.setItem('locations', JSON.stringify(locationsList.value))
  if (navigate) {
    router.push(`/forecast/${loc.name}`)
  }
}
</script>

<template>
  <h2 id="locTitle">Locations</h2>
  <label>
    Name:
    <input type="text" v-model="location.name" placeholder="Location name" />
  </label>
  <span v-if="errorMessage" class="error">{{ errorMessage }}</span>
  <!-- Display error message -->
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
  <h3>List</h3>
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
</template>

<style scoped>
/* Overall styling for the container */
.container {
  max-width: 600px; /* Limit max width for better readability */
  margin: 0 auto; /* Center the container */
  padding: 1em; /* Add some padding */
  background-color: #f9f9f9; /* Light background for contrast */
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Soft shadow effect */
}

/* Header styling */
h2,
h3 {
  color: #333; /* Dark color for headers */
  margin-bottom: 0.5em; /* Space below headers */
}

/* Label styling */
label {
  display: block;
  width: 100%; /* Full width */
  margin: 1em 0; /* Add vertical margin */
  font-size: 1.1em; /* Slightly larger font */
}

/* Input styling */
input[type='text'],
input[type='number'] {
  width: 100%; /* Full width inputs */
  padding: 0.5em; /* Padding inside inputs */
  border: 1px solid #ccc; /* Border color */
  border-radius: 4px; /* Rounded borders */
  transition: border-color 0.3s; /* Smooth transition for border */
}

/* Input focus effect */
input[type='text']:focus,
input[type='number']:focus {
  border-color: rgb(0, 189, 94); /* Blue border on focus */
  outline: none; /* Remove default outline */
  border-width: 3px;
}

/* Button styling */
button {
  background-color: rgb(0, 189, 94); /* Primary button color */
  color: white; /* Button text color */
  border-style: none;
  border-radius: 4px; /* Rounded corners */
  padding: 0.5em 1em; /* Button padding */
  cursor: pointer; /* Pointer cursor on hover */
  font-size: 1em; /* Consistent font size */
  margin-right: 0.5em; /* Space between buttons */
  transition: background-color 0.3s; /* Smooth transition for background */
}

/* Button hover effect */
button:hover {
  background-color: rgb(0, 141, 71); /* Darker shade on hover */
  border-style: solid;
  border-color: rgb(0, 141, 71);
  border-width: 2px;
}

/* List styling */
ul {
  list-style: none; /* Remove default list styles */
  padding: 0; /* Remove padding */
}

li {
  padding: 0.5em; /* Padding inside list items */
  margin: 0.5em 0; /* Margin between list items */
  position: relative; /* Position for child elements */
  border-radius: 4px; /* Rounded corners for list items */
  transition: background-color 0.3s; /* Smooth transition */
}

/* Highlight on hover for list items */
li:hover {
  background-color: rgb(0, 141, 71); /* Light gray on hover */
}

/* Default class for highlighting */
.default {
  font-weight: bold;
  background-color: rgb(0, 189, 94); /* Light blue for default location */
}

/* Remove button styling */
.remove {
  display: inline-block;
  position: absolute;
  right: -1em; /* Positioning */
  top: 50%; /* Center vertically */
  transform: translateY(-50%); /* Center adjustment */
  background-color: rgb(136, 0, 0); /* Remove button color */
  color: wheat; /* Remove button text color */
  padding: 0.6em 1em; /* Padding */
  border-radius: 4px; /* Rounded corners */
  cursor: pointer; /* Pointer on hover */
  transition: background-color 0.3s; /* Transition for color */
}

/* Remove button hover effect */
.remove:hover {
  background-color: rgb(200, 0, 0); /* Darker red on hover */
}

/* Error message styling */
.error {
  color: red; /* Red color for error message */
  font-size: 0.9em; /* Smaller font size */
  margin-top: 0.5em; /* Space above error message */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  /* Adjust button layout for smaller screens */
  button {
    margin-right: 0; /* Remove right margin on small screens */
    width: 100%; /* Full width on small screens */
    margin-bottom: 0.5em; /* Margin below buttons */
  }
}
#locTitle {
  font-size: 40px;
}
</style>
