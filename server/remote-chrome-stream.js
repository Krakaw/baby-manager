const CDP = require('chrome-remote-interface')

async function example () {
  let client
  try {
    // connect to endpoint
    client = await CDP()
    // extract domains
    const { Network, Page } = client
    // setup handlers
    Network.requestWillBeSent((params) => {
      // console.log(params.request.url)
    })
    // enable events then start!
    await Network.enable()
    await Page.enable()
    await Page.navigate({ url: 'http://192.168.0.100:3000' })
    await Page.loadEventFired()
    await Page.startScreencast({ format: 'png', everyNthFrame: 1 })

    while (true) {
      const { data, metadata, sessionId } = await Page.screencastFrame()
      process.stdout.write(Buffer.from(data, 'base64'))
      await Page.screencastFrameAck({ sessionId: sessionId })
    }
  } catch (err) {
    console.error(err)
  } finally {
    if (client) {
      await client.close()
    }
  }
}

example()
