var postcss = require('postcss')
var traderacss = require('./traderacss')
var plugin = require('./')

const run = (input, opts, resultCallback) => () => postcss([plugin(opts)]).process(input).then(resultCallback)

it('Maps colors from the color map, removing declarations and rules lacking colors', run(
  `a { color: #ffe; border-radius: 5px; background-color: #ffeeff; } a:hover { text-decoration: underline; }`,
  { '#ffe': 'dark-white', '#ffeeff': 'another-white' },
  result => {
    expect(result.css).toEqual('a { color: dark-white; background-color: another-white; }')
    expect(result.warnings()).toHaveLength(0)
  }
))
