const Playbook = require('./playbook')
const Item = require('./item')

class Playbooks {
  constructor (config, devices) {
    this.config = config
    this.playbooks = this.config.playbooks.map(playbook => new Playbook(playbook, devices))
  }

  find (name) {
    return this.playbooks.find(p => p.name === name)
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
