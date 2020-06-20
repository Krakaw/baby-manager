const Devices = require('./devices')
const Device = require('./device')
module.exports = (config) => {
  const devices = new Devices(config)
  return {
    devices,
    Device,
    Devices
  }
}
