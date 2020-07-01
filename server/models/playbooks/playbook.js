const Item = require('./item')
class Playbook {
  constructor (name = '', items = [], devices) {
    this.status = null
    this.name = name
    this.items = items.map(i => new Item(i.type, i.name, i.params, devices))
    this.queue = []
    this.stopped = false
    this.current = null
  }

  start () {
    this.stopped = false
    this.queue = [].concat(this.items)
    this.next()
  }

  stop () {
    this.stopped = true
    if (this.current) {
      this.current.stop()
    }
    this.queue.forEach(item => {
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
