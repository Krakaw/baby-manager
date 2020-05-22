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

function initialize (server, app) {
  const wss = new WebSocket.Server({ server, path: '/ws' })
  wss.on('connection', (ws) => {
    // connection is up, let's add a simple simple event
    ws.on('message', (message) => {
      try {
        const command = JSON.parse(message)
        const { action } = command
        switch (action) {
          case ACTION_CAST_START:
            _startCast(command, ws, app)
            break
          case ACTION_CAST_LIST:
            _listCasts(command, ws, app)
            break
          case ACTION_DEVICE_LIST:
            _listDevices(command, ws, app)
            break
          case ACTION_FILE_LIST:
            _listFiles(command, ws, app)
            break
          case ACTION_STREAM_ADD:
            _addStream(command, ws, app)
            break
          case ACTION_STREAM_LIST:
            _listStreams(command, ws, app)
            break
          default:
            throw Error(`Unknown action: ${action}`)
        }
      } catch (error) {
        ws.send(JSON.stringify({ error }))
      }
    })
    _listDevices({ action: ACTION_DEVICE_LIST }, ws, app)
    _listFiles({ action: ACTION_DEVICE_LIST }, ws, app)
    _listStreams({ action: ACTION_DEVICE_LIST }, ws, app)
    _listCasts({ action: ACTION_CAST_LIST }, ws, app)
  })

  app.wss = wss
}

function _startCast (command, ws, _app) {
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
      value: status
    }))
  })
}

function _listDevices (command, ws, _app) {
  const deviceList = Object.keys(cast.devices).map(deviceId => ({
    friendlyName: cast.devices[deviceId].friendlyName,
    deviceId: cast.devices[deviceId].host
  }))
  ws.send(JSON.stringify({
    action: ACTION_DEVICE_LIST,
    value: deviceList
  }))
}

function _listFiles (command, ws, app) {
  ws.send(JSON.stringify({
    action: ACTION_FILE_LIST,
    values: files.listFiles(app._filesPath).map(i => `${process.env.PUBLIC_URL}/files/${i}`)
  }))
}

function _addStream (command, ws, app) {
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

function _listStreams (command, ws, app) {
  ws.send(JSON.stringify({
    action: ACTION_STREAM_LIST,
    error: false,
    value: app._config.streams
  }))
}
function _listCasts (command, ws, app) {
  ws.send(JSON.stringify({
    action: ACTION_CAST_LIST,
    error: false,
    value: app._config.casts
  }))
}

module.exports = {
  initialize
}
