import { METHODS as HTTP_METHODS } from 'http'

const ALLOWED_METHODS = new Set(HTTP_METHODS)

export function lintAndFixMethods(rule) {
  if (rule.method && !Array.isArray(rule.method)) {
    rule.method = Array.of(rule.method)
  }
  // It's ok to have no methods
  if (rule.method) {
    lintMethods(rule.method)
  }
  return rule
}

export function lintMethods(methods) {
  for (const method of methods) {
    if (method && !ALLOWED_METHODS.has(method)) {
      const err = new Error(`Illegal HTTP method ${JSON.stringify(method)}, allowed methods: [${Array.from(ALLOWED_METHODS)}]`)
      throw err
    }
  }
}
