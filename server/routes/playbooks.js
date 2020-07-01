const express = require('express')
const router = express.Router()

module.exports = (playbooks) => {
  router.post('/start', (req, res) => {
    const { name } = req.body
    const playbook = playbooks.find(name)
    if (playbook) {
      playbook.start()
      res.sendStatus(200)
    } else {
      res.sendStatus(404)
    }
  })

  router.post('/stop', (req, res) => {
    const { name } = req.body
    const playbook = playbooks.find(name)
    if (playbook) {
      playbook.stop()
      res.sendStatus(200)
    } else {
      res.sendStatus(404)
    }
  })
  return router
}
