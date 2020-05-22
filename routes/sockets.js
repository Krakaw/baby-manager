const WebSocket = require('ws')
const cast = require('../helpers/cast')
const files = require('../helpers/files')

const ACTION_START_CAST = 'startCast'
const ACTION_ADD_STREAM = 'addStream'
const ACTION_LIST_STREAMS = 'listStreams'
const ACTION_LIST_FILES = 'listFiles'
const ACTION_LIST_DEVICES = 'listDevices'

function initialize (server, app) {
  const wss = new WebSocket.Server({ server, path: '/ws' })
  wss.on('connection', (ws) => {
    // connection is up, let's add a simple simple event
    ws.on('message', (message) => {
      try {
        const command = JSON.parse(message)
        const { action } = command
        switch (action) {
          case ACTION_START_CAST:
            _startCast(command, ws, app)
            break
          case ACTION_LIST_DEVICES:
            _listDevices(command, ws, app)
            break
          case ACTION_LIST_FILES:
            _listFiles(command, ws, app)
            break
          case ACTION_ADD_STREAM:
            _addStream(command, ws, app)
            break
          case ACTION_LIST_STREAMS:
            _listStreams(command, ws, app)
            break
          default:
            throw Error(`Unknown action: ${action}`)
        }
      } catch (error) {
        ws.send(JSON.stringify({ error }))
      }
    })
    _listDevices({ action: ACTION_LIST_DEVICES }, ws, app)
    _listFiles({ action: ACTION_LIST_DEVICES }, ws, app)
    _listStreams({ action: ACTION_LIST_DEVICES }, ws, app)
  })

  app.wss = wss
}

function _startCast (command, ws, _app) {
  const { url, deviceId } = command
  const device = cast.devices[deviceId]
  cast.castMedia(device, url, (error) => {
    ws.send(JSON.stringify({
      action: ACTION_START_CAST,
      error,
      value: `Playing ${url} on your ${device.friendlyName}`
    }))
  })
}

function _listDevices (command, ws, _app) {
  const deviceList = Object.keys(cast.devices).map(deviceId => ({
    friendlyName: cast.devices[deviceId].friendlyName,
    deviceId: cast.devices[deviceId].host
  }))
  ws.send(JSON.stringify({
    action: ACTION_LIST_DEVICES,
    value: deviceList
  }))
}

function _listFiles (command, ws, app) {
  ws.send(JSON.stringify({
    action: ACTION_LIST_FILES,
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
    action: ACTION_ADD_STREAM,
    error,
    value
  }))
}

function _listStreams (command, ws, app) {
  ws.send(JSON.stringify({
    action: ACTION_LIST_STREAMS,
    error: false,
    value: app._config.streams
  }))
}

module.exports = {
  initialize
}
