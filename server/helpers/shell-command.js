const { exec, spawn } = require('child_process')

class ShellCommand {
  launch (item, next, addStopper) {
    const process = spawn(item.params.command, item.params.opts.args)
    const pid = process.pid
    console.log('Spawned: ', pid, '[', item.params.command, item.params.opts.args, ']')
    process.on('exit', (code) => {
      addStopper(() => {
        console.log('Process already exited with code: ', code)
      })
      next()
    })
    addStopper(() => {
      if (item.params.opts.stopCommand) {
        exec(item.params.opts.stopCommand)
      } else {
        exec(`kill -9 ${pid}`)
      }
    })
  }
}

module.exports = ShellCommand
