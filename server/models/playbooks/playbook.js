const Item = require('./item')
class Playbook {
  constructor (name = '', items = [], devices) {
    this.status = null
    this.name = name
    this.items = items.map(i => new Item(i, devices))
    this.queue = []
    this.stopped = false
    this.current = null
  }

  runningItems () {
    return this.items.filter(i => i.running)
  }

  start () {
    this.stopped = false
    this.queue = [].concat(this.items)
    this.next()
  }

  stop () {
    this.stopped = true

    this.items.forEach(item => {
      item.stop()
    })
  }

  next () {
    if (this.queue.length && !this.stopped) {
      this.current = this.queue.shift()
      console.log('Running item', this.current.name)
      this.current.run(this.next.bind(this))
    } else {
      this.end()
    }
  }

  end () {

  }

  toJson () {
    return {
      name: this.name,
      items: [...this.items.map(item => item.toJson())]
    }
  }
}
module.exports = Playbook
