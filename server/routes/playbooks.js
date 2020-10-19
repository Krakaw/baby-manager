const express = require('express')
const router = express.Router()

module.exports = (playbooks) => {
  router.post('/start/:orName?', (req, res) => {
    const { name } = req.body
    const { orName } = req.params
    const playbookName = name || orName
    const playbook = playbooks.find(playbookName)
    if (playbook) {
      playbook.start()
      res.sendStatus(200)
    } else {
      res.sendStatus(404)
    }
  })

  router.post('/stop/:orName?', (req, res) => {
    try {
      const { name } = req.body
      const { orName } = req.params
      const playbookName = name || orName

      let playbookLists = []
      if (playbookName) {
        playbookLists.push(playbooks.find(playbookName))
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
