const Playbooks = require('./playbooks')
const Playbook = require('./playbook')
const Item = require('./item')
module.exports = (config) => {
  const playbooks = new Playbooks(config)
  if (process.env.AUTO_START_STREAMS) {
    playbooks.streams.forEach(item => {
      item.run()
    })
  }
  return {
    playbooks,
    Playbooks,
    Playbook,
    Item
  }
}
