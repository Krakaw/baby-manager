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
    device.on('status', (status) => {
      if (device._statusCallback) {
        device._statusCallback(status)
      }
    })
  }
})

function refreshDevices () {
  client.update()
}

function castMedia (device, url, playCallback, statusCallback) {
  console.log(`Playing ${url} on your ${device.friendlyName}`)
  device._url = url
  device._statusCallback = statusCallback
  device.play(url, playCallback)
}

module.exports = {
  devices,
  refreshDevices,
  castMedia
}
