var postcss = require('postcss')
var traderacss = require('./traderacss')

var plugin = require('./')

function run(input, output, opts) {
  return postcss([plugin(opts)]).process(input).then(function (result) {
    console.log(result.css)
    //expect(result.css).toEqual(output)
    expect(result.warnings()).toHaveLength(0)
  })
}

it('does something', function () {
  return run(traderacss, 'a{ }', {})
})
