const fs = require('fs')

function listFiles (filePath) {
  return fs.readdirSync(filePath).filter(f => f.indexOf('.') !== 0)
}

module.exports = {
  listFiles
}
