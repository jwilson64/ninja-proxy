import { Rule } from '../rules/rule'

export const destinationHandler = (req: any, lintedRules: Rule[]): string => {
  if (lintedRules.length) {
    for (const { pathnameRegexp, methods, destination } of lintedRules) {
      if (pathnameRegexp.test(req.url) && (!methods || methods[req.method.toLowerCase()])) return destination
    }
  }
  return undefined
}
