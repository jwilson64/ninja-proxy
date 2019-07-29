import micro from 'micro'
import { requestHandler } from './handlers'
import getDest from './functions'

module.exports = function(lintedRules) {
  const server = micro(async (req, res) => {
    try {
      const dest = getDest(req, lintedRules)

      if (!dest) {
        res.writeHead(404)
        res.end('404 - Not Found')
        return
      }

      await requestHandler(req, res, dest)
    } catch (err) {
      /* eslint-disable */
      console.error(err.stack)
      /* eslint-disable */

      res.end()
    }
  })
  return server
}
