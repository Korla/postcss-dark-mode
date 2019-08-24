const postcss = require('postcss')

// The order of the regexes matters since shorter regexes can also match the longer ones. The shorter 
// will replace the longer ones before they are run if they are run first.
const regexes = [
  /#([A-Fa-f0-9]{6})([; ,]|)/gi, // #ffeeff
  /#([A-Fa-f0-9]{3})([; ,]|)/gi // #ffe
]

module.exports = postcss.plugin(
  'postcss-dark-mode',
  opts => (root, result) => {
    root.walkRules(rule => {
      // Walk all rules in the stylesheet, if rule contains no declarations of color, the rule should be removed.
      let ruleHasMatch = false;
      rule.walkDecls(decl => {
        // Walk all declarations in a rule, if the declaration contains no color, the declaration is removed.
        let declHasMatch = false;
        regexes.forEach(regex => {
          (decl.value.match(regex) || []).forEach(match => {
            // If a match is found, the rule and declaration is kept.
            declHasMatch = true;
            ruleHasMatch = true;
            // TODO: If no matching color is found, a warning is created.
            // Each match which is found is run again, this time replacing the found value with the mapped value.
            decl.value = decl.value.replace(regex, opts[match])
          })
        })
        if (!declHasMatch) {
          decl.remove()
        }
      })
      if (!ruleHasMatch) {
        rule.remove();
      }
    })
  }
)
