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

    const state = item.params.state
    connection.setDevicePowerState(item.params.deviceid, state).then(r => {
      console.log('Setting switch', r, item.params.deviceid, state)
    }).catch(e => {
      console.error('Error setting switch', e)
    }).finally(() => {
      next()
    })
  }

  static async scanDevices (addDevice, config) {
    const { EWELINK_EMAIL, EWELINK_PASSWORD, EWELINK_REGION } = process.env
    if (!EWELINK_EMAIL || !EWELINK_PASSWORD) {
      console.log('No Ewelink credentials, ignoring scan.')
      return
    }
    try {
      console.log('Starting ewelink scanning')
      const connection = new EwelinkApi({
        email: EWELINK_EMAIL,
        password: EWELINK_PASSWORD,
        region: EWELINK_REGION || 'us'
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
