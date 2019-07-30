import { Rule } from '../rules/rule'

export const destinationHandler = (req: any, lintedRules: Rule[]) => {
  console.log(lintedRules)
  if (lintedRules.length) {
    lintedRules.find(rule => {
      const regex = new RegExp(rule.pathnameRe)
      return regex.test(req.url) && (!rule.methods || rule.methods[req.method.toLowerCase])
    })
  }
  return null
}
