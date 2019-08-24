let postcss = require('postcss')

module.exports = postcss.plugin('postcss-dark-mode', opts => {
  return (root, result) => {

    const colors = [];
    root.walkRules(rule => {
      rule.walkDecls(decl => {
        colors.push.apply(colors, getMatches(decl.value, /#([A-Fa-f0-9]{3})([; ,]|)/gi, 0));
        colors.push.apply(colors, getMatches(decl.value, /#([A-Fa-f0-9]{6})([; ,]|)/gi, 0));
        decl.value = decl.value.replace(/#([A-Fa-f0-9]{3})([; ,]|)/gi, 'var(--$1)$2');
        decl.value = decl.value.replace(/#([A-Fa-f0-9]{6})([; ,]|)/gi, 'var(--$1)$2');
      })
    })

    const uniqueColors = [...new Set(colors)];

    const cssVariables = postcss.rule({ selector: ":root" });
    uniqueColors.forEach(color => {
      cssVariables.append(postcss.decl({ prop: `--${color}`, value: `#${color}` }));
    });
    root.append(cssVariables);
    const cssVariablesDarkMode = postcss.rule({ selector: ".dark-mode" });
    uniqueColors.forEach(color => {
      cssVariablesDarkMode.append(postcss.decl({ prop: `--${color}`, value: `rebeccapurple` }));
    });
    root.append(cssVariablesDarkMode);
  }
})

function getMatches(string, regex, index) {
  index || (index = 1); // default to the first capturing group
  var matches = [];
  var match;
  while (match = regex.exec(string)) {
    matches.push(match[index]);
  }
  return matches;
}


/*
module.exports = postcss.plugin('postcss-dark-mode', opts => {
  return (root, result) => {
    root.walkRules(rule => {
      rule.walkDecls(decl => {
        decl.value = decl.value.replace(/#fff([; ,]|)/gi, 'var(--hello)$1')
        decl.value = decl.value.replace(/#ffffff([; ,]|)/gi, 'var(--hello)$1')
      })
    })

    const cssVariables = postcss.rule({ selector: ":root" });
    cssVariables.append(postcss.decl({prop: "--hello", value: "#fff" }));
    root.append(cssVariables);


    const cssVariablesDarkMode = postcss.rule({ selector: ".dark-mode" });
    cssVariablesDarkMode.append(postcss.decl({prop: "--hello", value: "#000" }));
    root.append(cssVariablesDarkMode);
  }
})
 */