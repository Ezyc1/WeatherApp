<!-- Map.vue -->
<template>
  <div id="map" ref="mapContainer" style="height: 500px"></div>
</template>

<script>
import L from 'leaflet'

export default {
  name: 'LeafletMap',
  data() {
    return {
      map: null,
    }
  },
  mounted() {
    this.initializeMap()
  },
  methods: {
    initializeMap() {
      this.map = L.map(this.$refs.mapContainer).setView([51.505, -0.09], 13)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map)

      L.marker([51.505, -0.09])
        .addTo(this.map)
        .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
        .openPopup()
    },
  },
}
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
