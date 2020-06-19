const Playbooks = require('./playbooks')
const playbooks = new Playbooks(process.env.CONFIG_FILE)
if (process.env.AUTO_START_STREAMS) {
  playbooks.streams.forEach(item => {
    item.run()
  })
}
module.exports = playbooks
