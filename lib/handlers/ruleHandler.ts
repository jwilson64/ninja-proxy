module.exports = (req, lintedRules = []) => {
    for (const { pathnameRegexp, methods, dest } of lintedRules) {
      if (pathnameRegexp.test(req.url) && (!methods || methods[req.method.toLowerCase()])) {
        return dest
      }
    }
  }
  