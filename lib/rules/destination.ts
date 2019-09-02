import { parse } from 'url'
import { Rule } from './rule'

export function lintDest(rule: Rule): Rule {
  const { destination, stub } = rule
  if ((!destination && !stub) || (destination && stub)) {
    const err: Error = new Error(`You must have a destination or stub. You may not have both present: ${JSON.stringify(rule)}`)
    throw err
  }

  if (destination) {
    const { host, protocol } = parse(destination)

    if (!host) {
      const err: Error = new Error(`Missing host for ${JSON.stringify(rule)}`)
      throw err
    }

    if (!protocol) {
      const err: Error = new Error(`Missing protocol for ${JSON.stringify(rule)}`)
      throw err
    }
  }

  return rule
}
