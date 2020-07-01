const mdns = require('mdns-js')
const Device = require('./device')
class Devices {
  constructor (config) {
    this.config = config
    this.devices = this.config.devices.map(device => {
      return new Device(device.type, device.name, device.params)
    })
    this.scanChromecasts()
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

  scanChromecasts () {
    this.browser = mdns.createBrowser(mdns.tcp('googlecast'))

    this.browser.on('ready', () => {
      this.browser.discover()
    })

    this.browser.on('update', (data) => {
      const device = Device.fromChromecast(data)
      if (device) {
        this.addDevice(device)
      }
    })
  }
}

module.exports = Devices
