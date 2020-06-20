const Client = require('castv2').Client
const mdns = require('mdns')
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
    this.devices.splice(this.devices.indexOf(this.getDevice(device.name)), 1, device)
    this.config.devices = this.devices
  }

  scanChromecasts () {
    this.browser = mdns.createBrowser(mdns.tcp('googlecast'))
    this.browser.on('serviceUp', (service) => {
      const device = Device.fromChromecast(service)
      this.addDevice(device)
    })

    this.browser.start()
  }
}

module.exports = Devices
