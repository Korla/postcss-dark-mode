const plugin = require('./');
var fs = require('fs');

require.extensions['.txt'] = function(module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const exampleCss = require('./examplecss.txt');

const run = (input, opts, resultCallback) => () =>
  postcss([plugin(opts)])
    .process(input)
    .then(resultCallback);
run(exampleCss, {}, res => console.log(res));
