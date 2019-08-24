var postcss = require('postcss')
var traderacss = require('./traderacss')
var plugin = require('./')

const run = (input, output, opts) => () => postcss([plugin(opts)]).process(input).then(result => {
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
})

it('Maps colors from the color map, removing declarations and rules lacking colors', run(
  'a { color: #ffe; border-radius: 5px; background-color: #ffeffe; } a:hover { text-decoration: underline; }',
  'a { color: dark-white; background-color: another-white; }',
  { '#ffe': 'dark-white', '#ffeffe': 'another-white' }
))
