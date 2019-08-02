/**
 * From Micro-proxy
 */
import * as WebSocket from 'ws'
import { parse } from 'url'
import { destinationHandler } from './handlers'
import { Rule } from './rules/rule'

const webSocketServer = (server, lintedRules) => {
  const wss = new WebSocket.Server({ server })
  wss.on('connection', (ws: any, req: any) => {
    const rule: Rule = destinationHandler(req, lintedRules)

    if (!rule) {
      ws.close()
      return
    }
    proxyWs(ws, req, rule.destination)
  })
  return server
}

function proxyWs(ws: any, req: any, dest: string) {
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

export default webSocketServer
