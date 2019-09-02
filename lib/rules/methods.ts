import { METHODS as HTTP_METHODS } from 'http'
import { Rule } from './rule'

const ALLOWED_METHODS = new Set(HTTP_METHODS)

export function lintAndFixMethods(rule: Rule) {
  if (rule.methods) {
    lintMethods(rule.methods)
  }
  return rule
}

export function lintMethods(methods: string[]) {
  for (const method of methods) {
    if (method && !ALLOWED_METHODS.has(method)) {
      const err = new Error(`Illegal HTTP method ${JSON.stringify(method)}, allowed methods: [${Array.from(ALLOWED_METHODS)}]`)
      throw err
    }
  }
}
