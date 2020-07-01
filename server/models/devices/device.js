const Chromecast = require('./chromecast')
class Device {
  constructor (type, name, params, status) {
    this.type = type
    this.name = name
    this.params = params
    this.status = status || Device.STATUS.UNKNOWN
    switch (this.type) {
      case Device.TYPES.DEVICE_TYPE_CHROMECAST:
        this.runner = new Chromecast(this)
        break
    }
  }

  toJson () {
    return {
      type: this.type,
      name: this.name,
      params: this.params
    }
  }
}

Device.fromChromecast = (chromecast) => {
  const txtRecord = {}
  if (chromecast.txt) {
    chromecast.txt.forEach(record => {
      const key = record.substr(0, record.indexOf('='))
      const value = record.substr(record.indexOf('=') + 1)
      txtRecord[key] = value
    })
    if (txtRecord.fn && txtRecord.md) {
      const params = {
        host: chromecast.host,
        port: chromecast.port,
        address: chromecast.addresses[0],
        friendlyName: txtRecord.fn,
        model: txtRecord.md,
        lastCast: txtRecord.rs
      }
      return new Device(Device.TYPES.DEVICE_TYPE_CHROMECAST, chromecast.name, params, Device.STATUS.READY)
    }
  }
  return undefined
}
Device.TYPES = {
  DEVICE_TYPE_CHROMECAST: 'DEVICE_TYPE_CHROMECAST'
}

Device.STATUS = {
  UNKNOWN: 'UNKNOWN',
  READY: 'READY'
}
module.exports = Device
