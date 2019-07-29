/**
 * From Micro-proxy
 */
const WebSocket = require('ws')
const { parse } = require('url')
const getDest = require('./functions')

module.exports = (server, lintedRules) => {
  const wss = new WebSocket.Server({ server })
  wss.on('connection', (ws, req) => {
    const dest = getDest(req, lintedRules)

    if (!dest) {
      ws.close()
      return
    }

    proxyWs(ws, req, dest)
  })
  return server
}

function proxyWs(ws, req, dest) {
  const destUrlObject = parse(dest)
  const newUrl = `ws://${destUrlObject.host}${req.url}`

  const destWs = new WebSocket(newUrl)

  // util functions
  const incomingHandler = message => {
    destWs.send(message)
  }

  const outgoingHandler = message => {
    ws.send(message)
  }

  const onError = err => {
    console.error(`Error on proxying url: ${newUrl}`)
    console.error(err.stack)
  }

  const removeListeners = () => {
    ws.removeListener('message', incomingHandler)
    destWs.removeListener('message', outgoingHandler)
  }

  // events handling
  destWs.on('open', () => {
    ws.addListener('message', incomingHandler)
    destWs.addListener('message', outgoingHandler)
  })

  ws.on('close', () => {
    destWs.close()
    removeListeners()
  })

  destWs.on('close', () => {
    ws.close()
    removeListeners()
  })

  ws.on('error', onError)
  destWs.on('error', onError)
}
