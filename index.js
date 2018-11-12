const lintRules = require('./lib/lint-rules')
const createServer = require('./lib/server')
const configureSocketServer = require('./lib/webSocketServer')

module.exports = rules => {
  const lintedRules = lintRules(rules).map(({ pathname, pathnameRe, method, dest, rewrite }) => {
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
      dest,
      rewrite,
      methods,
    }
  })

  const server = createServer(lintedRules)

  return configureSocketServer(server, lintedRules)
}
