const Client = require('castv2-client').Client
const DefaultMediaReceiver = require('castv2-client').DefaultMediaReceiver
class Chromecast {
  constructor (device) {
    this.device = device
    this.client = null
    this.receiver = null
    this.requestId = 1
    this.connect()
  }

  launch (data) {
    console.log('Receiver', this.receiver)
    this.receiver.send({
      ...{
        type: 'LAUNCH',
        appId: 'CC1AD845',
        requestId: this.requestId++
      },
      ...data
    })
  }

  connect () {
    const { host } = this.device.params
    const client = new Client()
    client.connect(host, () => {
      // create various namespace handlers
      const connection = client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.tp.connection', 'JSON')
      const heartbeat = client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.tp.heartbeat', 'JSON')
      const receiver = client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.receiver', 'JSON')

      // establish virtual connection to the receiver
      connection.send({ type: 'CONNECT' })

      // start heartbeating
      setInterval(function () {
        heartbeat.send({ type: 'PING' })
      }, 5000)

      // launch YouTube app
      // receiver.send({ type: 'LAUNCH', appId: 'YouTube', requestId: 1 })
      // receiver.send({
      //   type: 'LAUNCH',
      //   appId: 'CC1AD845',
      //   requestId: this.requestId++,
      //   data: 'http://192.168.0.101:3000/files/dream.mp3'
      // })
      // display receiver status updates
      receiver.on('message', function (data, broadcast) {
        if (data.type === 'RECEIVER_STATUS') {
          console.log(data.status)
        }
      })
      receiver.on('error', function (e) {
        console.error('Chromecast Client error', e)
      })
      this.receiver = receiver
    })
    this.client = client
  }
}

module.exports = Chromecast
