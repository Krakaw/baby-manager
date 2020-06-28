const stream = require('../../helpers/stream')
class Item {
  constructor (type, name = '', params = {}, devices) {
    this.devices = devices
    this.status = null
    this.type = type
    this.name = name
    this.params = params
  }

  run (next) {
    switch (this.type) {
      case Item.TYPES.TYPE_RTSP_STREAM:
        stream.startStream(this.params.url, this.params.port)
        this.status = Item.STATUS.RTSP_STREAMING
        break
      case Item.TYPES.TYPE_MEDIA: {
        const chromecastDevice = this.devices.getDevice(this.params.destination)
        console.log('casting', this.params)
        chromecastDevice.runner.launch(this.params, next)
        break
      }
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
Item.createSwitch = (url = '', state = Item.SWITCH.SWITCH_OFF) => {
  return {
    name: '',
    type: Item.TYPES.TYPE_SWITCH,
    params: {
      url,
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
Item.TYPES = {
  TYPE_MEDIA: 'TYPE_MEDIA',
  TYPE_SWITCH: 'TYPE_SWITCH',
  TYPE_RTSP_STREAM: 'TYPE_RTSP_STREAM'
}
Item.REPEAT = {
  REPEAT_OFF: 'REPEAT_OFF',
  REPEAT_SINGLE: 'REPEAT_SINGLE'
}
Item.SWITCH = {
  SWITCH_OFF: 'SWITCH_OFF',
  SWITCH_ON: 'SWITCH_ON'
}
Item.STATUS = {
  RTSP_STREAMING: 'RTSP_STREAMING',
  RTSP_STOPPED: 'RTSP_STOPPED'
}

module.exports = Item
