const Device = require('./device')
const Chromecast = require('./chromecast')
const Ewelink = require('./ewelink')

class Devices {
  constructor (config) {
    this.config = config
    this.devices = this.config.devices.map(device => {
      return new Device(device.type, device.name, device.params, undefined, config)
    })
    this.scanDevices().then(r => {
      console.log('Finished scanning')
    }).catch(e => {
      console.error('Error scanning devices', e)
    })
  }

  getDevice (name) {
    return this.devices.find(device => device.name === name)
  }

  addDevice (device, idKey = 'name') {
    const currentDeviceIndex = this.devices.indexOf(this.getDevice(device[idKey]))
    if (currentDeviceIndex === -1) {
      this.devices.push(device)
    } else {
      this.devices.splice(currentDeviceIndex, 1, device)
    }
    this.config.devices = this.devices.map(device => device.toJson())
  }

  async scanDevices () {
    await Chromecast.scanDevices(this.addDevice.bind(this))
    await Ewelink.scanDevices(this.addDevice.bind(this), this.config)
  }
}

module.exports = Devices
