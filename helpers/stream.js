const Stream = require('node-rtsp-stream')

function startStream (streamUrl, streamWsPort) {
  const stream = new Stream({
    name: 'name',
    streamUrl: streamUrl, // process.env.SOURCE_STREAM_URL,
    wsPort: streamWsPort, // process.env.STREAM_PORT || 9998,
    ffmpegOptions: { // options ffmpeg flags
      '-stats': '', // an option with no neccessary value uses a blank string
      '-r': 30 // options with required values specify the value after the key
    }
  })
  return stream
}

function startStreams (streams) {
  streams.forEach(stream => {
    const { streamUrl, streamWsPort } = stream
    startStream(streamUrl, streamWsPort)
  })
}

module.exports = {
  startStream,
  startStreams
}
