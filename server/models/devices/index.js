const Devices = require('./devices')
const Device = require('./device')
module.exports = (config) => {
  const devices = new Devices(config)
  setTimeout(() => {
    const d = devices.getDevice('af3e623c-3215-c7ea-26b0-c2661ee9bad9.local.')
    console.log(d)
    // d.runner.launch({ data: 'http://192.168.0.101:3000/files/dream.mp3' })
  }, 5000)

  return {
    devices,
    Device,
    Devices
  }
}
