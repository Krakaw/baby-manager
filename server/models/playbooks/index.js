const Playbooks = require('./playbooks')
const Playbook = require('./playbook')
const Item = require('./item')
module.exports = (config, devices) => {
  const playbooks = new Playbooks(config, devices)
  if (process.env.AUTO_START_STREAMS) {
    playbooks.streams.forEach(item => {
      item.run().bind(item)
    })
  }
  return {
    playbooks,
    Playbooks,
    Playbook,
    Item
  }
}
