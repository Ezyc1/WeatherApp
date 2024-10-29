export function getPosition() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        resolve({
          position: {
            lat: pos.coords.latitude,
            long: pos.coords.longitude,
          },
        })
      })
    } else {
      reject('Geolocation is not supported by this browser.')
    }
  })
}
