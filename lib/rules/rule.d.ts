export interface Rule {
  pathname: string
  destination: string

  pathnameRegexp?: RegExp
  pathnameRe?: string

  methods?: string[]

  rewrite?: string
  headers?: any
}
