class Item {
  constructor (opts = {}) {
    const defaults = Item.createMedia()
    this.options = {
      ...defaults,
      ...opts
    }
  }
}

Item.createMedia = (url = '', repeat = Item.REPEAT.REPEAT_NONE) => {
  return {
    name: '',
    type: Item.TYPES.TYPE_MEDIA,
    params: {
      url,
      repeat
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
  REPEAT_NONE: 'REPEAT_NONE',
  REPEAT_SINGLE: 'REPEAT_SINGLE'
}
Item.SWITCH = {
  SWITCH_OFF: 'SWITCH_OFF',
  SWITCH_ON: 'SWITCH_ON'
}

module.exports = Item
