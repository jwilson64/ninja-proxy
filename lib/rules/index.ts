/* eslint-disable */
import { lintKeys } from './keys'
import { lintAndFixMethods } from './methods'
import { lintAndFixPathname } from './pathname'
import { lintDest } from './destination'

const MAX_RULES_LIMIT = 20

export function lintRules(rules) {
  const cleanedRules = []

  if (rules.length > MAX_RULES_LIMIT) {
    const err = new Error(`Maximum rule count of 20 exceeded. Found ${rules.length} rules.`)
    throw err
  }

  for (let rule of rules) {
    // Don't let in unwanted entries
    lintKeys(rule)

    // Make sure methods is an array etc.
    rule = lintAndFixMethods(rule)
    rule = lintDest(rule)
    rule = lintAndFixPathname(rule)
    cleanedRules.push(rule)
  }

  return cleanedRules
}
