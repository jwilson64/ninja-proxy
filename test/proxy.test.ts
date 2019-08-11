/* global describe, it, expect */

import { createInfoServer, fetchProxy } from './util'
import * as micro from 'micro'
import * as listen from 'test-listen'
import * as fetch from 'node-fetch'
import createProxy from '../index'

describe('Basic Proxy Operations', () => {
  describe('rules', () => {
    it('should proxy with a exactly matching pathname rule', async () => {
      const s1 = await createInfoServer()
      const proxy = createProxy([{ pathname: '/abc', destination: s1.url }])
      await listen(proxy)

      const { data } = await fetchProxy(proxy, '/abc')
      expect(data.url).toBe('/abc')

      proxy.close()
      s1.close()
    })

    it('should proxy with a wildcard matching pathname rule', async () => {
      const s1 = await createInfoServer()
      const proxy = createProxy([
        { pathname: '/abc', destination: 'http://localhost' },
        { pathname: '/blog/**', destination: s1.url },
      ])
      await listen(proxy)

      const { data } = await fetchProxy(proxy, '/blog/hello')
      expect(data.url).toBe('/blog/hello')

      proxy.close()
      s1.close()
    })

    it('should proxy with no pathname as the catch all rule', async () => {
      const s1 = await createInfoServer()
      const proxy = createProxy([
        { pathname: '/abc', destination: 'http://localhost' },
        { pathname: '/blog/**', destination: s1.url },
      ])
      await listen(proxy)

      const { data } = await fetchProxy(proxy, '/blog/hello')
      expect(data.url).toBe('/blog/hello')

      proxy.close()
      s1.close()
    })

    it('should send 404 if no matching rule found', async () => {
      const s1 = await createInfoServer()
      const proxy = createProxy([{ pathname: '/abc', destination: 'http://localhost' }])
      await listen(proxy)

      const { res } = (await fetchProxy(proxy, '/blog/hello')) as any
      expect(res.status).toBe(404)

      proxy.close()
      s1.close()
    })

    it('should proxy to the first matching rule', async () => {
      const s1 = await createInfoServer()
      const proxy = createProxy([
        { pathname: '/abc/**', destination: s1.url },
        { pathname: '/abc/blog/**', destination: 'http://localhost' },
      ])
      await listen(proxy)

      const { data } = await fetchProxy(proxy, '/abc/blog/nice-one')
      expect(data.url).toBe('/abc/blog/nice-one')

      proxy.close()
      s1.close()
    })
  })

  describe('methods', () => {
    it('should proxy for a method in the list', async () => {
      const s1 = await createInfoServer()
      const proxy = createProxy([{ pathname: '/blog/**', method: ['GET', 'POST'], destination: s1.url }])
      await listen(proxy)

      const { data } = await fetchProxy(proxy, '/blog/hello')
      expect(data.url).toBe('/blog/hello')

      proxy.close()
      s1.close()
    })

    it('should not proxy for a method which is not in the list', async () => {
      const s1 = await createInfoServer()
      const proxy = createProxy([{ pathname: '/blog/**', method: ['GET', 'POST'], destination: s1.url }])
      await listen(proxy)

      const { res } = (await fetchProxy(proxy, '/blog/hello', { method: 'OPTIONS' })) as any
      expect(res.status).toBe(404)

      proxy.close()
      s1.close()
    })

    it('should proxy for any method if no methods provided', async () => {
      const s1 = await createInfoServer()
      const proxy = createProxy([{ pathname: '/blog/**', destination: s1.url }])
      await listen(proxy)

      const { data } = await fetchProxy(proxy, '/blog/hello', { method: 'OPTIONS' })
      expect(data.method).toBe('OPTIONS')

      proxy.close()
      s1.close()
    })
  })

  describe('rewrite', () => {
    it('should rewrite /home to /', async () => {
      const s1 = await createInfoServer()
      const proxy = createProxy([{ pathname: '/home', destination: s1.url, rewrite: '/' }])
      await listen(proxy)

      const { data } = await fetchProxy(proxy, '/home')
      expect(data.url).toBe('/')

      proxy.close()
      s1.close()
    })
  })

  describe('headers', () => {
    it('should add headers from the rule to the request', async () => {
      const s1 = await createInfoServer()
      const proxy = createProxy([{ pathname: '/home', destination: s1.url, headers: { mytoken: 'test token' } }])
      await listen(proxy)

      const { data } = await fetchProxy(proxy, '/home')
      expect(data.headers.mytoken).toBe('test token')

      proxy.close()
      s1.close()
    })

    it('should overwrite a default header. */* -> application/json', async () => {
      const s1 = await createInfoServer()
      const proxy = createProxy([{ pathname: '/home', destination: s1.url, headers: { accept: 'application/json' } }])
      await listen(proxy)

      const { data } = await fetchProxy(proxy, '/home')
      expect(data.headers.accept).toBe('application/json')

      proxy.close()
      s1.close()
    })
  })

  describe('other', () => {
    it('should proxy the POST body', async () => {
      const s1 = await createInfoServer()
      const proxy = createProxy([{ pathname: '/blog/**', destination: s1.url }])
      await listen(proxy)

      const body = 'hello-body'
      const { data } = await fetchProxy(proxy, '/blog/hello', {
        method: 'POST',
        body,
      })

      expect(data.body).toBe(body)

      proxy.close()
      s1.close()
    })

    it('should forward request headers', async () => {
      const s1 = await createInfoServer()
      const proxy = createProxy([{ pathname: '/blog/**', destination: s1.url }])
      await listen(proxy)

      const token = 'a4n59lx83'
      const { data } = await fetchProxy(proxy, '/blog/hello', {
        method: 'POST',
        headers: {
          'zeit-token': token,
        },
      })

      expect(data.headers['zeit-token']).toBe(token)

      proxy.close()
      s1.close()
    })

    it('should override host header using destination', async () => {
      const s1 = await createInfoServer()
      const proxy = createProxy([{ pathname: '/blog/**', destination: s1.url }])
      await listen(proxy)

      const { data } = await fetchProxy(proxy, '/blog/hello', {
        method: 'POST',
        headers: {
          host: 'my-host.com',
        },
      })

      expect(data.headers['host']).not.toBe('my-host.com')
      expect(data.headers['host']).toContain('localhost')

      proxy.close()
      s1.close()
    })

    it('should forward original status code', async () => {
      const s1 = await createInfoServer()
      const proxy = createProxy([{ pathname: '/**', destination: s1.url }])
      await listen(proxy)

      const { res } = (await fetchProxy(proxy, '/404')) as any

      expect(res.status).toBe(404)

      proxy.close()
      s1.close()
    })

    it('should send back response headers', async () => {
      const header = 'THE_HEADER'
      const s1 = micro(async (req, res) => {
        res.writeHead(200, {
          'output-header': header,
        })
        res.end()
      })
      await listen(s1)

      const proxy = createProxy([{ pathname: '/blog/**', destination: `http://localhost:${s1.address().port}` }])
      await listen(proxy)

      const res: any = await fetch(`http://localhost:${proxy.address().port}/blog/hello`, undefined)
      expect(res.headers.get('output-header')).toBe(header)

      proxy.close()
      s1.close()
    })
  })
})
