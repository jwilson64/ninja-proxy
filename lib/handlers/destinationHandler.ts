import { Rule } from '../rules/rule'

export const destinationHandler = (req: any, lintedRules: Rule[]): Rule => {
  if (lintedRules.length) {
    for (const rule of lintedRules) {
      if (rule.pathnameRegexp.test(req.url) && (!rule.methods || rule.methods[req.method.toLowerCase()])) return rule
    }
  }
  return undefined
}
