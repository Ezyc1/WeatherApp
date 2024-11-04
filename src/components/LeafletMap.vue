<template>
  <div id="map" ref="mapContainer" style="height: 500px"></div>
</template>

<script>
import L from 'leaflet'

export default {
  name: 'LeafletMap',
  props: {
    centerPosition: {
      type: Object,
      default: () => ({ lat: 51.505, long: -0.09 }), // Standardkoordinater
    },
  },
  data() {
    return {
      map: null, // Referens till Leaflet-kartan
    }
  },
  mounted() {
    this.initializeMap() // Initierar kartan när komponenten är monterad
  },
  watch: {
    centerPosition: {
      immediate: true,
      handler(newPosition) {
        if (this.map) {
          // Uppdaterar kartans vy vid ändring av centerPosition
          this.map.setView([newPosition.lat, newPosition.long], 13)
        }
      },
    },
  },
  methods: {
    initializeMap() {
      // Skapar en Leaflet-karta med initial position och zoomnivå
      this.map = L.map(this.$refs.mapContainer).setView(
        [this.centerPosition.lat, this.centerPosition.long],
        13,
      )

      // Lägg till OpenStreetMap-lager för kartdata
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map)

      // Skapar en markör på kartan för den aktuella positionen
      L.marker([this.centerPosition.lat, this.centerPosition.long])
        .addTo(this.map)
        .bindPopup('You are here.')
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
