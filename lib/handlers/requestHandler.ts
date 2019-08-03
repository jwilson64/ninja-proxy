import fetch from 'node-fetch'
import { resolve, URL } from 'url'
import { Rule } from '../rules/rule'

export const requestHandler = async (req: any, res: any, rule: Rule): Promise<void> => {
  const { destination, rewrite } = rule
  const tempUrl: string = resolve(destination, rewrite || req.url)
  const cleanUrl: URL = new URL(tempUrl)
  const newUrl: string = resolve(destination, `${cleanUrl.pathname}${cleanUrl.search}`)
  const url: URL = new URL(destination)
  const proxyRes = await fetch(newUrl, {
    method: req.method,
    headers: {
      ...req.headers,
      ...rule.headers,
      host: url.host,
    },
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
