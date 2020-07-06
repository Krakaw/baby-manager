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
  devices: [],
  arp: []
}
class Config {
  constructor (path) {
    this.saveDebounce = null
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

  get devices () {
    return this._data.devices
  }

  set devices (devices) {
    this._data.devices = devices
    this.saveConfig()
  }

  get arp () {
    return this._data.arp
  }

  set arp (arp) {
    this._data.arp = arp
    this.saveConfig()
  }

  set playbooks (playbooks) {
    this._data.playbooks = playbooks
    this.saveConfig()
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
      contents = JSON.stringify(DEFAULT_CONFIG)
      this.saveConfig(DEFAULT_CONFIG)
    }
    return {
      ...DEFAULT_CONFIG,
      ...JSON.parse(contents)
    }
  }

  saveConfig (config) {
    clearTimeout(this.saveDebounce)
    this.saveDebounce = setTimeout(() => {
      config = config || this._data
      const data = JSON.stringify(config, null, 2)
      fs.writeFileSync(this._path, data)
    }, 1000)
  }
}

module.exports = Config
