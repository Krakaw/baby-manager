const Device = require('./device')
const Chromecast = require('./chromecast')
const Ewelink = require('./ewelink')

class Devices {
  constructor (config) {
    this.config = config
    this.devices = this.config.devices.map(device => {
      return new Device(device.type, device.name, device.params)
    })
    this.scanDevices()
  }

  getDevice (name) {
    return this.devices.find(device => device.name === name)
  }

  addDevice (device) {
    const currentDeviceIndex = this.devices.indexOf(this.getDevice(device.name))
    if (currentDeviceIndex === -1) {
      this.devices.push(device)
    } else {
      this.devices.splice(currentDeviceIndex, 1, device)
    }
    this.config.devices = this.devices.map(device => device.toJson())
  }

  scanDevices () {
    Chromecast.scanDevices(this.addDevice.bind(this))
    Ewelink.scanDevices(this.addDevice.bind(this))
  }
}

module.exports = Devices
