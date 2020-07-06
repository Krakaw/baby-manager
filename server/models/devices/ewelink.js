const EwelinkApi = require('ewelink-api')
const Zeroconf = require('ewelink-api/src/classes/Zeroconf')

class Ewelink {
  static async scanDevices (addDevice) {
    try {
      const connection = new EwelinkApi({
        email: process.env.EWELINK_EMAIL,
        password: process.env.EWELINK_PASSWORD,
        region: process.env.EWELINK_REGION || 'us'
      })
      const devices = await connection.saveDevicesCache()
      console.log('Ewelink', devices)
      const arp = await Zeroconf.saveArpTable({
        ip: process.env.LOCAL_NETWORK
      })
      console.log('ARP', arp)
    } catch (e) {
      console.error('Ewelink error', e)
    }
    console.log('Finished')
  }
}

module.exports = Ewelink
