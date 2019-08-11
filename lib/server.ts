import * as micro from 'micro'
import { requestHandler, destinationHandler } from './handlers/index'
import { Rule } from './rules/rule'

export function createServer(lintedRules) {
  const server = micro(async (req, res) => {
    try {
      const rule: Rule = destinationHandler(req, lintedRules)
      if (!rule) {
        res.writeHead(404)
        res.end('404 - Not Found')
        return
      }
      await requestHandler(req, res, rule)
    } catch (err) {
      /* eslint-disable */
      console.error(err.stack)
      /* eslint-disable */

      res.end()
    }
  })
  return server
}
