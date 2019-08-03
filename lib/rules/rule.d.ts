export interface Rule {
  pathname: string
  destination: string
  pathnameRegexp?: RegExp
  pathnameRe?: string
  method?: string[] | string
  methods?: string[]
  rewrite?: string
  headers?: any
}
