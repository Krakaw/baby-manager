const ShellCommand = require('../../helpers/shell-command')
const stream = require('../../helpers/stream')
const fetch = require('node-fetch')

class Item {
  constructor (item, devices) {
    const { type, name = '', params = {}, async = false } = item
    this.devices = devices
    this.type = type
    this.name = name
    this.async = async
    this.params = params
    this.status = null
    this.running = false
    this.stopper = () => {
      console.log('No stopper loaded for %s', this.name)
    }
  }

  run (next) {
    let asyncNext = () => {}
    if (this.async) {
      asyncNext = next
      next = () => {}
    }
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

        case Item.TYPES.TYPE_DELAY:
          setTimeout(() => {
            next()
          }, this.params.timeout)
          break

        case Item.TYPES.TYPE_SWITCH: {
          const ewelinkDevice = this.devices.getDevice(this.params.deviceid)
          ewelinkDevice.runner.launch(this, next)
        }
          break
        case Item.TYPES.TYPE_WEBHOOK:
          fetch(this.params.url, this.params.opts).then(r => {
            r.text().then((body) => {
              console.log('Webhook result', this.params.url, body)
            }).finally(() => {
              next()
            })
          })
          break
        case Item.TYPES.TYPE_SHELL_COMMAND: {
          const cmd = new ShellCommand()
          cmd.launch(this, next, (stop) => {
            this.stopper = stop
          })
        }

          break
      }
    } catch (e) {
      console.error(e)
    } finally {
      asyncNext()
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
      playlist: [{
        url,
        repeat,
        destination
      }]

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

Item.createWebHook = (url = '', opts = {}) => {
  return {
    name: '',
    type: Item.TYPES.TYPE_WEBHOOK,
    params: {
      url,
      opts: {
        method: 'GET',
        headers: {},
        ...opts
      }
    }
  }
}

Item.createShellCommand = (command = '', opts = {}) => {
  return {
    name: '',
    type: Item.TYPES.TYPE_SHELL_COMMAND,
    params: {
      command,
      opts: {
        args: [],
        stopCommand: null,
        ...opts
      }
    }
  }
}

Item.TYPES = {
  TYPE_MEDIA: 'TYPE_MEDIA',
  TYPE_SWITCH: 'TYPE_SWITCH',
  TYPE_RTSP_STREAM: 'TYPE_RTSP_STREAM',
  TYPE_DELAY: 'TYPE_DELAY',
  TYPE_WEBHOOK: 'TYPE_WEBHOOK',
  TYPE_SHELL_COMMAND: 'TYPE_SHELL_COMMAND'
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
