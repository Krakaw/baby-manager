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
    try {
      const { name } = req.body
      let playbookLists = []
      if (name) {
        playbookLists.push(playbooks.find(name))
      } else {
        playbookLists = playbookLists.concat(playbooks.playbooks)
      }

      if (playbookLists.length) {
        playbookLists.forEach(playbook => {
          playbook.stop()
        })
        res.sendStatus(200)
      } else {
        res.sendStatus(404)
      }
    } catch (e) {
      console.error(e)
    }
  })

  router.get('', (req, res) => {
    const data = {
      playbooks: playbooks.playbooks.map(p => ({
        name: p.name,
        runningItems: p.runningItems().map(i => i.name)
      }))
    }
    return res.json(data)
  })
  return router
}
