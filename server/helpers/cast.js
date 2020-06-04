const ChromecastAPI = require('chromecast-api')
const Client = require('castv2').Client
const { ACTIONS } = require('../constants/sockets')

class Cast {
  constructor (sockets) {
    this.devices = {}
    this.client = new ChromecastAPI()
    this.sockets = sockets
    this.debounceResume = {}
    this.initOnDevice()
  }

  initOnDevice () {
    this.client.on('device', this._addDevice.bind(this))
  }

  _addDevice (device) {
    const deviceId = device.host
    if (!this.devices[deviceId]) {
      this.devices[deviceId] = device
      // All devices must loop
      device.on('finished', (e) => {
        if (this.debounceResume[deviceId] < (new Date()).getTime() - 60000) {
          device.play(device._url, e => {
            this.debounceResume[deviceId] = (new Date()).getTime()
            console.log('Resuming', e)
          })
        } else {
          console.log('Play happened too recently')
        }
      })
      device.on('status', (status) => {
        this.broadcastStatus(deviceId, status)
      })
    }
  }

  broadcastStatus (deviceId, status) {
    this.sockets.broadcast({
      action: ACTIONS.ACTION_CAST_STATUS,
      error: false,
      value: { deviceId, status }
    })
  }

  refeshDevices () {
    this.client.update()
  }

  castStatus (deviceId, callback) {
    try {
      const statusClient = new Client()
      statusClient.on('error', (e) => {
        console.log('statusClient Error', e)
      })
      statusClient.connect(deviceId, () => {
        const connection = statusClient.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.tp.connection', 'JSON')
        const receiver = statusClient.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.receiver', 'JSON')
        connection.send({ type: 'CONNECT' })
        connection.on('error', (e) => {
          console.log(e)
        })
        receiver.on('error', (e) => {
          console.log(e)
        })
        receiver.send({ type: 'GET_STATUS', requestId: 1 })
        receiver.on('message', (data, broadcast) => {
          if (data.type === 'RECEIVER_STATUS') {
            if (callback) {
              callback(deviceId, data.status)
            }
            this.broadcastStatus(deviceId, data.status)
          }
        })
      })
    } catch (e) {
      console.error('Error in castStatus', e)
    }
  }

  castMedia (deviceId, url, callback) {
    const device = this.devices[deviceId]
    console.log(`Playing ${url} on your ${device.friendlyName}`)
    device._url = url
    device.play(url, { displayName: 'Test Device' }, (err) => {
      callback(err, device)
    })
  }

  castStop (deviceId, callback) {
    const device = this.devices[deviceId]
    device.stop((err) => {
      callback(err, callback)
    })
  }
}

module.exports = Cast
