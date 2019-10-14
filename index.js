const postcss = require('postcss');
const regexesObject = require('./regex');

module.exports = postcss.plugin('postcss-dark-mode', opts => (root, result) => {
  const missingMappings = {};
  const regexes = Object.values(regexesObject);
  root.walkRules(originalRule => {
    // Walk all rules in the stylesheet, if the rule contains a declaration with color, the rule should be appended to the stylesheet.
    const rule = originalRule.clone();
    rule.selector = rule.selector
      .split(',')
      .map(selector => `.theming-darkmode ${selector}`)
      .join(',');
    rule.removeAll();
    let ruleHasMatch = false;

    // Walk all declarations in a rule, if the declaration contains color, the declaration is added to the rule.
    originalRule.walkDecls(originalDecl => {
      const decl = originalDecl.clone();
      let declHasMatch = false;
      regexes.forEach(regex => {
        (originalDecl.value.match(regex) || []).forEach(match => {
          const colorToInsert = opts.darkmode[match];
          // If no matching color is found, a warning is created and the declaration isn't kept.
          if (colorToInsert === undefined) {
            if (opts.debugColors) {
              missingMappings[match] = missingMappings[match] || [];
              missingMappings[match].push(originalRule);
            } else {
              result.warn(
                `Color '${match}' lacks mapping (Rule: '${originalRule}')`
              );
            }
            return;
          } else if (colorToInsert === null) {
            // TODO: test this
            // If the config uses null for a color, that color should not be mapped
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
  if (opts.debugColors) {
    // TODO: test this
    const missing = Object.entries(missingMappings)
      .sort(([m1], [m2]) => (m1 < m2 ? -1 : 1))
      .reduce((prev, [match]) => `${prev}'${match}': null,`, '');
    console.log(`{${missing}}`);
  }
});

const escapeRegexLiterals = regexString =>
  regexString.replace(/\(/g, '\\(').replace(/\)/g, '\\)');
