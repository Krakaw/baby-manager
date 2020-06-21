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
  const params = {
    host: chromecast.host,
    port: chromecast.port,
    address: chromecast.addresses[0],
    friendlyName: chromecast.txtRecord.fn,
    model: chromecast.txtRecord.md,
    lastCast: chromecast.txtRecord.rs
  }
  return new Device(Device.TYPES.DEVICE_TYPE_CHROMECAST, chromecast.host, params, Device.STATUS.READY)
}
Device.TYPES = {
  DEVICE_TYPE_CHROMECAST: 'DEVICE_TYPE_CHROMECAST'
}

Device.STATUS = {
  UNKNOWN: 'UNKNOWN',
  READY: 'READY'
}
module.exports = Device
