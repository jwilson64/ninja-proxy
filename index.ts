import { lintRules } from './lib/rules/index'
import { createServer } from './lib/server'
import configureSocketServer from './lib/webSocketServer'
import { Rule } from './lib/rules/rule'

export const createProxy = (rules: Rule[]) => {
  const lintedRules = lintRules(rules).map(({ pathname, pathnameRe, methods, destination, rewrite, headers }) => {
    let methodObj = null
    if (methods) {
      methodObj = methods.reduce((final, c) => {
        final[c.toLowerCase()] = true
        return final
      }, {})
    }

    return {
      pathname,
      pathnameRegexp: new RegExp(pathnameRe || pathname || '.*'),
      destination,
      rewrite,
      methods: methodObj,
      headers,
    }
  })

  const server = createServer(lintedRules)
  return configureSocketServer(server, lintedRules)
}

export default createProxy
