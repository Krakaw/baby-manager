const fs = require('fs')
const Playbook = require('./playbook')
const Item = require('./item')

const DEFAULT_CONFIG = []
class Playbooks {
  constructor (config) {
    this.config = config
    this.playbooks = this.config.playbooks.map(playbook => new Playbook(playbook.name, playbook.items))
  }

  addPlaybook (playbook) {
    if (this.playbooks.find(p => p.name === playbook.name)) {
      throw Error('Playbook by that name already exists')
    }
    this.playbooks.push(playbook.toJson())

    this.config.playbooks = this.playbooks
  }

  get streams () {
    let streams = []
    this.playbooks.forEach(playbook => {
      streams = streams.concat(playbook.items.filter(item => item.type === Item.TYPES.TYPE_RTSP_STREAM))
    })
    return streams
  }
}

module.exports = Playbooks
