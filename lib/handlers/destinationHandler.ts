import { Rule } from '../rules/rule'

export const destinationHandler = (req: any, lintedRules: Rule[]) => {
  if (lintedRules.length) {
    const rule = lintedRules.find(lintedRule => {
      const regex = new RegExp(lintedRule.pathnameRe)
      return regex.test(req.url) && (!lintedRule.methods || lintedRule.methods[req.method.toLowerCase])
    })
    return rule.destination
  }
  return null
}
