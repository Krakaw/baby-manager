const WebSocket = require('ws')
const cast = require('../helpers/cast')
const files = require('../helpers/files')

const ACTION_CAST_STATUS = 'castStatus'
const ACTION_CAST_START = 'castStart'
const ACTION_CAST_LIST = 'castList'
const ACTION_STREAM_ADD = 'streamAdd'
const ACTION_STREAM_LIST = 'streamList'
const ACTION_FILE_LIST = 'fileList'
const ACTION_DEVICE_LIST = 'deviceList'

class Sockets {
  constructor (server, app) {
    this.wss = new WebSocket.Server({ server, path: '/ws' })
    this.app = app
    this.app.wss = this.wss
    this.onConnection()
  }

  onConnection () {
    const app = this.app
    this.wss.on('connection', (ws) => {
      // connection is up, let's add a simple simple event
      ws.on('message', (message) => {
        try {
          const command = JSON.parse(message)
          const { action } = command
          this[`${action}`](command, ws, app)
        } catch (error) {
          ws.send(JSON.stringify({ error }))
        }
      })
      this.onClientConnected(ws)
    })
  }

  onClientConnected (ws) {
    const app = this.app
    this.deviceList({ action: ACTION_DEVICE_LIST }, ws, app)
    this.fileList({ action: ACTION_DEVICE_LIST }, ws, app)
    this.streamList({ action: ACTION_DEVICE_LIST }, ws, app)
    this.castList({ action: ACTION_CAST_LIST }, ws, app)
  }

  castStart (command, ws, _app) {
    const { url, deviceId } = command
    const device = cast.devices[deviceId]
    cast.castMedia(device, url, (error) => {
      ws.send(JSON.stringify({
        action: ACTION_CAST_START,
        error,
        value: `Playing ${url} on your ${device.friendlyName}`
      }))
    }, (status) => {
      ws.send(JSON.stringify({
        action: ACTION_CAST_STATUS,
        error: false,
        value: { deviceId, status }
      }))
    })
  }

  deviceList (command, ws, _app) {
    const deviceList = Object.keys(cast.devices).map(deviceId => ({
      friendlyName: cast.devices[deviceId].friendlyName,
      deviceId: cast.devices[deviceId].host
    }))
    ws.send(JSON.stringify({
      action: ACTION_DEVICE_LIST,
      value: deviceList
    }))
  }

  fileList (command, ws, app) {
    ws.send(JSON.stringify({
      action: ACTION_FILE_LIST,
      value: files.listFiles(app._filesPath).map(i => `${process.env.PUBLIC_URL}/files/${i}`)
    }))
  }

  streamAdd (command, ws, app) {
    const config = app._config
    let error
    const value = config.addStream(command)
    if (!value) {
      error = 'There was an error adding the stream'
    }
    ws.send(JSON.stringify({
      action: ACTION_STREAM_ADD,
      error,
      value
    }))
  }

  streamList (command, ws, app) {
    ws.send(JSON.stringify({
      action: ACTION_STREAM_LIST,
      error: false,
      value: app._config.streams
    }))
  }

  castList (command, ws, app) {
    ws.send(JSON.stringify({
      action: ACTION_CAST_LIST,
      error: false,
      value: app._config.casts
    }))
  }
}

module.exports = Sockets
