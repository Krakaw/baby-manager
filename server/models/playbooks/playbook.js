const Item = require('./item')
class Playbook {
  constructor (playbook, devices, config, playbookIndex) {
    const { name = '', items = [], stopItems = [] } = playbook
    this.config = config
    this.status = null
    this.name = name
    this.items = items.map(i => new Item(i, devices))
    this.stopItems = stopItems.map(i => new Item(i, devices))
    this.queue = []
    this.stopped = false
    this.runningStoppedItems = false
    this.current = null
    this.debugEndCount = 0
    this.playbookIndex = playbookIndex
    this.activeItemIndex = 0
  }

  runningItems () {
    return this.items.filter(i => i.running)
  }

  start (startAtStep = 0) {
    this.activeItemIndex = startAtStep
    this.stopped = false
    const items = [].concat(this.items)
    this.queue = items.splice(startAtStep)
    this.next()
  }

  stop () {
    this.stopped = true

    this.items.forEach(item => {
      item.stop()
    })
  }

  next () {
    if (this.queue.length && (this.runningStoppedItems || !this.stopped)) {
      this.current = this.queue.shift()
      console.log('Running item', this.current.name)
      try {
        this.config.addActivePlaybookItem(this.playbookIndex, this.activeItemIndex)
        this.activeItemIndex++
        this.current.run(this.next.bind(this))
      } catch (e) {
        console.log('Error running item', e)
      }
    } else {
      this.end()
    }
  }

  end () {
    this.debugEndCount++
    console.log('Debug End Called', this.debugEndCount, 'times')
    if (this.runningStoppedItems) {
      return
    }
    this.runningStoppedItems = true
    this.queue = [].concat(this.stopItems)
    this.next()
    this.config.removeActivePlaybook(this.playbookIndex)
  }

  toJson () {
    return {
      name: this.name,
      items: [...this.items.map(item => item.toJson())]
    }
  }
}
module.exports = Playbook
