const fs = require('fs')
const DEFAULT_CONFIG = {
  castMap: [
    // {url, deviceId}
  ],
  streams: [
    // {streamUrl, streamWsPort}
  ]
}
class Config {
  constructor (path) {
    this._path = path
    this._data = this.loadConfig()
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
    const streams = this.streams.concat({ stream })
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
    const data = JSON.stringify(config)
    fs.writeFileSync(this._path, data)
    return data
  }
}

module.exports = Config
