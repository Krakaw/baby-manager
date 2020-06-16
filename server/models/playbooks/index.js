const Playbooks = require('./playbooks')

module.exports = new Playbooks(process.env.CONFIG_FILE)
