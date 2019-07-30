import micro from 'micro'
import { requestHandler, destinationHandler } from './handlers'

export function createServer(lintedRules) {
  console.log('Creating Server')
  const server = micro(async (req, res) => {
    try {
      const dest = destinationHandler(req, lintedRules)
      console.log('Dest!', dest)
      if (!dest) {
        res.writeHead(404)
        res.end('404 - Not Found')
        return
      }

      await requestHandler(req, res, dest)
      console.log('server created')
    } catch (err) {
      /* eslint-disable */
      console.error(err.stack)
      /* eslint-disable */

      res.end()
    }
  })
  return server
}
