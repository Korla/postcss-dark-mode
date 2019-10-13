const postcss = require('postcss');
const regexesObject = require('./regex');

module.exports = postcss.plugin('postcss-dark-mode', opts => (root, result) => {
  const regexes = Object.values(regexesObject);
  root.walkRules(originalRule => {
    // Walk all rules in the stylesheet, if the rule contains a declaration with color, the rule should be appended to the stylesheet.
    const rule = originalRule.clone();
    rule.selector = `.theming-darkmode ${rule.selector}`
    rule.removeAll();
    let ruleHasMatch = false;

    // Walk all declarations in a rule, if the declaration contains color, the declaration is added to the rule.
    originalRule.walkDecls(originalDecl => {
      const decl = originalDecl.clone();
      let declHasMatch = false;
      regexes.forEach(regex => {
        (originalDecl.value.match(regex) || []).forEach(match => {
          // If no matching color is found, a warning is created and the declaration isn't kept.
          const colorToInsert = opts[match];
          if (!colorToInsert) {
            result.warn(`Color '${match}' lacks mapping (Rule: '${originalRule}')`);
            return;
          }
          // If a match is found, the rule and declaration is kept.
          declHasMatch = true;
          ruleHasMatch = true;
          // Each match which is found is run again, this time replacing the found value with the mapped value.
          const escapedRegexLiteral = escapeRegexLiterals(match);
          const regexToReplace = new RegExp(
            `${escapedRegexLiteral}(?=($|\\s))`,
            'gi'
          );
          decl.value = decl.value.replace(regexToReplace, colorToInsert);
        });
      });
      if (declHasMatch) {
        rule.append(decl);
      }
    });
    if (ruleHasMatch) {
      originalRule.after(rule);
    }
  });
});

const escapeRegexLiterals = regexString =>
  regexString.replace(/\(/g, '\\(').replace(/\)/g, '\\)');
