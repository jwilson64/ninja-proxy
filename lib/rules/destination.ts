import { parse } from 'url'
import { Rule } from './rule'

interface DestinationError extends Error {
  statusCode: number
}

export function lintDest(rule: Rule): Rule {
  if (!rule.destination) {
    const err: Error = new Error(`Missing destination ${JSON.stringify(rule)}`)
    throw err
  }

  const { host, protocol } = parse(rule.destination)

  if (!host) {
    const err: Error = new Error(`Missing host for ${JSON.stringify(rule)}`)
    throw err
  }

  if (!protocol) {
    const err: Error = new Error(`Missing protocol for ${JSON.stringify(rule)}`)
    throw err
  }

  return rule
}
