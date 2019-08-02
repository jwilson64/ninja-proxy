import * as micro from 'micro'
import { requestHandler, destinationHandler } from './handlers'

export function createServer(lintedRules) {
  const server = micro(async (req, res) => {
    try {
      const destination = destinationHandler(req, lintedRules)
      if (!destination) {
        res.writeHead(404)
        res.end('404 - Not Found')
        return
      }
      await requestHandler(req, res, destination)
    } catch (err) {
      /* eslint-disable */
      console.error(err.stack)
      /* eslint-disable */

      res.end()
    }
  })
  return server
}
