import { parse } from 'url'
import { Rule } from './rule'

export function lintAndFixPathname(rule: Rule): Rule {
  if (!rule.pathname) {
    rule.pathnameRe = new RegExp('.*')
    return rule
  }
  // Strip down possible query and stuff
  rule.pathname = parse(rule.pathname).pathname
  // glob
  if (rule.pathname.indexOf('*') > 0) {
    // Since this output will be thrown into regex engine, we need to make sure they don't inject regex...
    let pathnameRe = rule.pathname
    // Escape all possible regex particles
    pathnameRe = pathnameRe.replace(/[\-\[\]\{\}\(\)\+\?\.\\\^\$\|]/g, '\\$&')

    // glob
    pathnameRe = pathnameRe.replace(/\*\*/g, '(.*)') // ** -> .*
    pathnameRe = pathnameRe.replace(/([^.])(\*)/g, '$1([^/]*)') // * -> .* within path separators
    pathnameRe = pathnameRe.replace('?', '.') // ? -> .
    rule.pathnameRe = new RegExp(`^${pathnameRe}$`)
  } else {
    rule.pathnameRe = new RegExp(rule.pathname)
  }
  return rule
}
