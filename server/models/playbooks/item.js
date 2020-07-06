const stream = require('../../helpers/stream')
class Item {
  constructor (type, name = '', params = {}, devices) {
    this.devices = devices
    this.status = null
    this.type = type
    this.name = name
    this.params = params
    this.running = false
    this.stopper = () => {
      console.log('No stopper loaded for %s', this.name)
    }
  }

  run (next) {
    console.log('Running type', this.type)
    this.running = true
    try {
      switch (this.type) {
        case Item.TYPES.TYPE_RTSP_STREAM:
          stream.startStream(this.params.url, this.params.port)
          this.status = Item.STATUS.RTSP_STREAMING
          break
        case Item.TYPES.TYPE_MEDIA:
          var chromecastDevice = this.devices.getDevice(this.params.destination)
          chromecastDevice.runner.launch(this, next, (stop) => {
            this.stopper = stop
          })
          break

        case Item.TYPES.TYPE_DELAY: {
          setTimeout(() => {
            next()
          }, this.params.timeout)
        }
          break

        case Item.TYPES.TYPE_SWITCH: {
          const ewelinkDevice = this.devices.getDevice(this.params.deviceid)
          ewelinkDevice.runner.launch(this, next)
        }
          break
      }
    } catch (e) {
      console.error(e)
    }
  }

  stop () {
    this.running = false
    this.stopper()
  }

  toJson () {
    return {
      type: this.type,
      name: this.name,
      params: this.params
    }
  }
}

Item.createMedia = (url = '', repeat = Item.REPEAT.REPEAT_OFF, destination = '') => {
  return {
    name: '',
    type: Item.TYPES.TYPE_MEDIA,
    params: {
      url,
      repeat,
      destination
    }
  }
}
Item.createSwitch = (deviceid = '', state = Item.SWITCH.SWITCH_OFF) => {
  return {
    name: '',
    type: Item.TYPES.TYPE_SWITCH,
    params: {
      deviceid,
      state
    }
  }
}
Item.createStream = (url = '', port = 9998) => {
  return {
    name: '',
    type: Item.TYPES.TYPE_STREAM,
    params: {
      url,
      port
    }
  }
}

Item.createDelay = (timeout) => {
  return {
    name: '',
    type: Item.TYPES.TYPE_DELAY,
    params: {
      timeout
    }
  }
}
Item.TYPES = {
  TYPE_MEDIA: 'TYPE_MEDIA',
  TYPE_SWITCH: 'TYPE_SWITCH',
  TYPE_RTSP_STREAM: 'TYPE_RTSP_STREAM',
  TYPE_DELAY: 'TYPE_DELAY'
}
Item.REPEAT = {
  REPEAT_OFF: 'REPEAT_OFF',
  REPEAT_SINGLE: 'REPEAT_SINGLE'
}
Item.SWITCH = {
  SWITCH_OFF: 'off',
  SWITCH_ON: 'on'
}
Item.STATUS = {
  RTSP_STREAMING: 'RTSP_STREAMING',
  RTSP_STOPPED: 'RTSP_STOPPED'
}

module.exports = Item
