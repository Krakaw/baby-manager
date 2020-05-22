const ChromecastAPI = require('chromecast-api')
const client = new ChromecastAPI()
const devices = {}

client.on('device', (device) => {
  if (!devices[device.host]) {
    devices[device.host] = device
    // All devices must loop
    device.on('finished', (e) => {
      device.play(device._url, e => {
        console.log('Resuming', e)
      })
    })
  }
})
function refreshDevices () {
  client.update()
}

function castMedia (device, url, callback) {
  console.log(`Playing ${url} on your ${device.friendlyName}`)
  device._url = url
  device.play(url, callback)
}

module.exports = {
  devices,
  refreshDevices,
  castMedia
}
