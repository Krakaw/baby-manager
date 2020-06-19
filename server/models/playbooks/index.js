const Playbooks = require('./playbooks')
const Item = require('./item')

const playbooks = new Playbooks(process.env.CONFIG_FILE)
if (process.env.AUTO_START_STREAMS) {
  playbooks.playbooks.forEach(playbook => {
    playbook.items.filter(item => item.type === Item.TYPES.TYPE_RTSP_STREAM).forEach(item => {
      item.run()
    })
  })
}
module.exports = playbooks
