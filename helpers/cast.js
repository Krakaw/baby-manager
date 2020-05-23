const ChromecastAPI = require('chromecast-api')
const Client = require('castv2').Client
const { ACTIONS } = require('../constants/sockets')

class Cast {
  constructor (sockets) {
    this.devices = {}
    this.client = new ChromecastAPI()
    this.sockets = sockets
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
        device.play(device._url, e => {
          console.log('Resuming', e)
        })
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
    const statusClient = new Client()
    statusClient.connect(deviceId, () => {
      const connection = statusClient.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.tp.connection', 'JSON')
      const receiver = statusClient.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.receiver', 'JSON')
      connection.send({ type: 'CONNECT' })
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
  }

  castMedia (deviceId, url, callback) {
    const device = this.devices[deviceId]
    console.log(`Playing ${url} on your ${device.friendlyName}`)
    device._url = url
    device.play(url, (err) => {
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
