const EwelinkApi = require('ewelink-api')
const Zeroconf = require('ewelink-api/src/classes/Zeroconf')
const Device = require('./device')
const constants = require('./constants')

class Ewelink {
  constructor (device) {
    this.device = device
  }

  launch (item, next, _addStopper) {
    const devicesCache = [this.device.params]
    const arpTable = this.device.config.arp
    const connection = new EwelinkApi({ devicesCache, arpTable })
    connection.setDevicePowerState(item.params.deviceid, item.params.state).then(r => {
      console.log('Setting switch', r, item.params.deviceid, item.params.state)
    }).catch(e => {
      console.error('Error setting switch', e)
    }).finally(() => {
      next()
    })
  }

  static async scanDevices (addDevice, config) {
    try {
      console.log('Starting ewelink scanning')
      const connection = new EwelinkApi({
        email: process.env.EWELINK_EMAIL,
        password: process.env.EWELINK_PASSWORD,
        region: process.env.EWELINK_REGION || 'us'
      })
      const devices = await connection.getDevices()
      devices.forEach(device => {
        addDevice(Ewelink.fromEwelink(device, config))
      })
      const arp = await Zeroconf.getArpTable(process.env.LOCAL_NETWORK)
      if (arp && arp.length) {
        config.arp = arp
      }
    } catch (e) {
      console.error('Ewelink error', e)
    }
  }

  static fromEwelink (ewelink, config) {
    return new Device(constants.DEVICE_TYPES.EWELINK, ewelink.deviceid, ewelink, constants.DEVICE_STATUS.READY, config)
  }
}

module.exports = Ewelink
