const Item = require('./item')
class Playbook {
  constructor (name = '', items = []) {
    this.name = name
    this.items = items.map(i => new Item(i))
  }

  toJson () {
    return JSON.stringify(this.items)
  }
}
module.exports = Playbook
