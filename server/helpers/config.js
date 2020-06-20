const fs = require('fs')
const DEFAULT_CONFIG = {
  casts: [
    // {url, deviceId}
  ],
  streams: [
    // {streamUrl, streamWsPort}
  ],
  playbooks: [
    // Playbook
  ],
  devices: []
}
class Config {
  constructor (path) {
    this._path = path
    this._data = this.loadConfig()
  }

  get casts () {
    return this._data.casts
  }

  set casts (casts) {
    this._data.casts = casts
    this.saveConfig(this._data)
  }

  get playbooks () {
    return this._data.playbooks
  }

  set devices (devices) {
    this._data.devices = devices
    this.saveConfig(this._data)
  }

  get devices () {
    return this._data.devices
  }

  set playbooks (playbooks) {
    this._data.playbooks = playbooks
    this.saveConfig(this._data)
  }

  addCast (cast) {
    if (this.casts.find(i => i.url === cast.url && i.deviceId === cast.deviceId)) {
      return false
    }
    const casts = this.casts.concat({ ...cast })
    this.casts = casts
    return cast
  }

  get streams () {
    return this._data.streams
  }

  set streams (streams) {
    this._data.streams = streams
    this.saveConfig(this._data)
  }

  addStream (stream) {
    const { streamUrl, streamWsPort } = stream
    if (this.streams.find(i => i.streamWsPort === streamWsPort || i.streamUrl === streamUrl)) {
      return false
    }
    const streams = this.streams.concat({ ...stream })
    this.streams = streams
    return stream
  }

  loadConfig () {
    let contents = ''

    if (fs.existsSync(this._path)) {
      contents = fs.readFileSync(this._path)
    } else {
      contents = this.saveConfig(DEFAULT_CONFIG)
    }
    return {
      ...DEFAULT_CONFIG,
      ...JSON.parse(contents)
    }
  }

  saveConfig (config) {
    const data = JSON.stringify(config, null, 2)
    fs.writeFileSync(this._path, data)
    return data
  }
}

module.exports = Config
