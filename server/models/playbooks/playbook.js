const Item = require('./item')
class Playbook {
  constructor (name = '', items = [], devices) {
    this.status = null
    this.name = name
    this.items = items.map(i => new Item(i.type, i.name, i.params, devices))
    this.queue = []
  }

  start () {
    this.queue = [].concat(this.items)
    this.next()
  }

  next () {
    if (this.queue.length) {
      const item = this.queue.shift()
      console.log('Running item', item.name)
      item.run(this.next.bind(this))
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
