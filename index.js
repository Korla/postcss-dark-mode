let postcss = require('postcss')

const regexes = [
  /#([A-Fa-f0-9]{6})([; ,]|)/gi,
  /#([A-Fa-f0-9]{3})([; ,]|)/gi
]

module.exports = postcss.plugin(
  'postcss-dark-mode',
  opts => (root, result) => {
    root.walkRules(rule => {
      let ruleHasMatch = false;
      rule.walkDecls(decl => {
        const allMatches = [];
        regexes.forEach(r => allMatches.push.apply(allMatches, (decl.value.match(r) || []).map(m => ({ match: m, regex: r }))))
        if (!allMatches.length) {
          decl.remove()
        } else {
          allMatches.forEach(m => decl.value = decl.value.replace(m.regex, opts[m.match]))
          ruleHasMatch = true;
        }
      })
      if (!ruleHasMatch) {
        rule.remove();
      }
    })
  }
)
