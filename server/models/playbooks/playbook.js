const Item = require('./item')
class Playbook {
  constructor (name = '', items = []) {
    this.status = null
    this.name = name
    this.items = items.map(i => new Item(i.type, i.name, i.params))
  }

  toJson () {
    return {
      name: this.name,
      items: [...this.items.map(item => item.toJson())]
    }
  }
}
module.exports = Playbook
