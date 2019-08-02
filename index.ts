import { lintRules } from './lib/rules'
import { createServer } from './lib/server'
import configureSocketServer from './lib/webSocketServer'
import { Rule } from './lib/rules/rule'

export const createProxy = (rules: Rule[]) => {
  const lintedRules = lintRules(rules).map(({ pathname, pathnameRe, method, destination, rewrite }) => {
    let methods = null
    if (method) {
      methods = method.reduce((final, c) => {
        final[c.toLowerCase()] = true
        return final
      }, {})
    }

    return {
      pathname,
      pathnameRegexp: new RegExp(pathnameRe || pathname || '.*'),
      destination,
      rewrite,
      methods,
    }
  })

  const server = createServer(lintedRules)
  return configureSocketServer(server, lintedRules)
}

export default createProxy
