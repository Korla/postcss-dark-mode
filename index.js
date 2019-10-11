const postcss = require('postcss');
const regexesObject = require('./regex');

const regexes = Object.values(regexesObject);

module.exports = postcss.plugin('postcss-dark-mode', opts => (root, result) => {
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
          const escapedRegexLiteral = escapeRegexLiterals(match);
          const regexToReplace = new RegExp(
            `${escapedRegexLiteral}(?=($|\\s))`,
            'gi'
          );
          decl.value = decl.value.replace(regexToReplace, opts[match]);
        });
      });
      if (!declHasMatch) {
        decl.remove();
      }
    });
    if (!ruleHasMatch) {
      rule.remove();
    }
  });
});

const escapeRegexLiterals = regexString =>
  regexString.replace(/\(/g, '\\(').replace(/\)/g, '\\)');
