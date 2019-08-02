const ALLOWED_KEYS = new Set(['method', 'pathname', 'destination', 'rewrite'])

export function lintKeys(rule) {
  for (const key of Object.keys(rule)) {
    if (!ALLOWED_KEYS.has(key)) {
      if (key.toLowerCase() === 'path') {
        const err = new Error('Did you mean pathname')
        throw err
      }
      const err = new Error(`Illegal key ${key} in rule ${JSON.stringify(rule)}, allowed keys: [${Array.from(ALLOWED_KEYS)}]`)
      throw err
    }
  }
}
