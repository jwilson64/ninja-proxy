export interface Rule {
  pathname: string
  destination: string
  pathnameRe?: RegExp
  methods?: string[]
  rewrite?: string
  headers?: any
}
