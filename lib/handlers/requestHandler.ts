import fetch from 'node-fetch'
import { resolve, URL } from 'url'

export const requestHandler = async (req: any, res: any, destination: string): Promise<void> => {
  const tempUrl: string = resolve(destination, req.url)
  const cleanUrl: URL = new URL(tempUrl)
  const newUrl: string = resolve(destination, `${cleanUrl.pathname}${cleanUrl.search}`)
  const url: URL = new URL(destination)
  const proxyRes = await fetch(newUrl, {
    method: req.method,
    headers: {
      ...req.headers,
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
