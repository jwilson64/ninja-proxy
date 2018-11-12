const micro = require('micro')
const fetch = require('node-fetch')
const { resolve, URL } = require('url')
const getDest = require('./functions')

async function proxyRequest(req, res, dest) {
  const tempUrl = resolve(dest, req.url)
  const cleanUrl = new URL(tempUrl)
  const newUrl = resolve(dest, `${cleanUrl.pathname}${cleanUrl.search}`)
  const url = new URL(dest)
  const proxyRes = await fetch(newUrl, {
    method: req.method,
    headers: Object.assign({}, req.headers, { host: url.host }),
    body: req,
    compress: false,
  })

  // Forward status code
  res.statusCode = proxyRes.status

  // Forward headers
  const headers = proxyRes.headers.raw()
  for (const key of Object.keys(headers)) {
    res.setHeader(key, headers[key])
  }

  // Stream the proxy response
  proxyRes.body.pipe(res)
  proxyRes.body.on('error', err => {
    console.error(`Error on proxying url: ${newUrl}`)
    console.error(err.stack)
    res.end()
  })

  req.on('abort', () => {
    proxyRes.body.destroy()
  })
}

module.exports = function(lintedRules) {
  const server = micro(async (req, res) => {
    try {
      const dest = getDest(req, lintedRules)

      if (!dest) {
        res.writeHead(404)
        res.end('404 - Not Found')
        return
      }

      await proxyRequest(req, res, dest)
    } catch (err) {
      /* eslint-disable */
      console.error(err.stack)
      /* eslint-disable */

      res.end()
    }
  })
  return server
}
