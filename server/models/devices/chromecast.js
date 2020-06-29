const Client = require('castv2-client').Client
const DefaultMediaReceiver = require('castv2-client').DefaultMediaReceiver
var util = require('util')

class Chromecast {
  constructor (device) {
    this.device = device
    this.client = null
    this.receiver = null
    this.requestId = 1
  }

  launch (data, next) {
    const client = new Client()
    const { host, port } = this.device.params
    const result = {
      stop: () => { console.error('Player has not been loaded yet'); return false }
    }
    client.connect({ host, port }, () => {
      console.log('Connected to ', this.device.params.friendlyName)
      client.launch(DefaultMediaReceiver, (err, player) => {
        if (err) {
          console.error('client.launch error', err)
        }
        result.stop = () => {
          player.stop()
          return true
        }
        const media = [{
          autoplay: true,
          preloadTime: 3,
          startTime: 1,
          activeTrackIds: [],
          repeatMode: data.repeat,
          media: {
            contentId: data.url,
            contentType: data.contentType || 'audio/mpeg',
            streamType: 'BUFFERED',
            metadata: {
              type: 0,
              metadataType: 0,
              title: data.title || data.url.split('/').pop(),
              images: data.images || []
            }
          }

        }]
        player.on('status', (status) => {
          if (data.repeat !== 'REPEAT_SINGLE' && status.idleReason === 'FINISHED' && status.loadingItemId === undefined) {
            console.log('Item completed')
            next()
          }
          console.log('Player status', status)
        })
        console.log('app "%s" launched, loading media %s ...', player.session.displayName, media.contentId)

        player.queueLoad(media, { startIndex: 0, repeatMode: data.repeat || 'REPEAT_OFF' }, (err, status) => {
          if (err) {
            console.error('player.load error', err)
            return
          }
          console.log('status broadcast = %s', util.inspect(status), ' ')
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
}

module.exports = Chromecast
