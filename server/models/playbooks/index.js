const Playbooks = require('./playbooks')

module.exports = (config) => {
  const playbooks = new Playbooks(config)
  if (process.env.AUTO_START_STREAMS) {
    playbooks.streams.forEach(item => {
      item.run()
    })
  }
  return playbooks
}
