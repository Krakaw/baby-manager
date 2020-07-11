const Client = require('castv2-client').Client
const DefaultMediaReceiver = require('castv2-client').DefaultMediaReceiver
const Device = require('./device')
const mdns = require('mdns-js')
const constants = require('./constants')

class Chromecast {
  constructor (device) {
    this.device = device
  }

  launch (item, next, addStopper) {
    const data = item.params
    const client = new Client()
    const { host, port } = this.device.params
    const result = {
      stop: () => { console.error('Player has not been loaded yet'); return false }
    }
    client.connect({ host, port }, () => {
      console.log('Connected to {} on {}:{}', this.device.params.friendlyName, host, port)
      client.launch(DefaultMediaReceiver, (err, player) => {
        if (err) {
          console.error('client.launch error', err)
          return
        }

        const mediaPlaylist = [].concat(data.playlist || data).map(playlist => ({
          autoplay: true,
          preloadTime: playlist.preloadTime || 10,
          startTime: playlist.startTime || 0,
          activeTrackIds: [],
          repeatMode: playlist.repeat,
          media: {
            contentId: playlist.url,
            contentType: playlist.contentType || 'audio/mpeg',
            streamType: 'BUFFERED',
            metadata: {
              type: 0,
              metadataType: 0,
              title: playlist.title || playlist.url.split('/').pop(),
              images: playlist.images || []
            }
          }
        }))

        console.log(mediaPlaylist)
        addStopper(() => {
          try {
            client.stop(player, () => {
              console.log('Stopped')
            })
          } catch (e) {
            console.log('stopper error', e)
          }
          return true
        })

        player.on('status', (status) => {
          console.log('Player status', status)
          if (data.repeat !== 'REPEAT_SINGLE' && status.idleReason === 'FINISHED' && status.loadingItemId === undefined) {
            console.log('Item completed')
            item.running = false
            next()
          }
          // console.log('Player status', status)
        })
        console.log('app "%s" launched, loading media %s ...', player.session.displayName, mediaPlaylist[0].media.contentId)

        player.queueLoad(mediaPlaylist, { startIndex: 0, repeatMode: data.repeat || 'REPEAT_OFF' }, (err, status) => {
          if (err) {
            console.error('player.load error', err)
          } else {

          }
          // console.log('status broadcast = %s', util.inspect(status), ' ')
        })
        if (data.repeat === 'REPEAT_SINGLE') {
          next()
        }
      })
    })
    client.on('error', (err) => {
      console.error('Chromecast client error', err)
      client.close()
    })
    return result
  }

  static async scanDevices (addDevice) {
    this.browser = mdns.createBrowser(mdns.tcp('googlecast'))

    this.browser.on('ready', () => {
      this.browser.discover()
    })

    this.browser.on('update', (data) => {
      const device = Chromecast.fromChromecast(data)
      if (device) {
        addDevice(device)
      }
    })
  }
}

Chromecast.fromChromecast = (chromecast) => {
  const txtRecord = {}
  if (chromecast.txt) {
    chromecast.txt.forEach(record => {
      const key = record.substr(0, record.indexOf('='))
      const value = record.substr(record.indexOf('=') + 1)
      txtRecord[key] = value
    })
    if (txtRecord.fn && txtRecord.md) {
      const params = {
        host: chromecast.host,
        port: chromecast.port,
        address: chromecast.addresses[0],
        friendlyName: txtRecord.fn,
        model: txtRecord.md,
        lastCast: txtRecord.rs
      }
      return new Device(constants.DEVICE_TYPES.CHROMECAST, chromecast.fullname, params, constants.DEVICE_STATUS.READY)
    }
  }
  return undefined
}

module.exports = Chromecast
