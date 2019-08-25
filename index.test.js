var postcss = require('postcss')
var traderacss = require('./traderacss')
var plugin = require('./')

const run = (input, opts, resultCallback) => () => postcss([plugin(opts)]).process(input).then(resultCallback)

it('Maps colors using the color map', run(
  `a { color: #ffe; border-radius: 5px; background-color: #ffeeff; }`,
  { '#ffe': 'red', '#ffeeff': 'blue' },
  result => {
    expect(result.css).toEqual('a { color: red; background-color: blue; }')
    expect(result.warnings()).toHaveLength(0)
  }
))

it('Removes rules which lack color declaraions', run(
  `a { color: #ffe; } a:hover { text-decoration: underline; }`,
  { '#ffe': 'red' },
  result => {
    expect(result.css).toEqual('a { color: red; }')
    expect(result.warnings()).toHaveLength(0)
  }
))

it('Removes declarations which lack color', run(
  `a { color: #ffe; border-radius: 5px; }`,
  { '#ffe': 'red' },
  result => {
    expect(result.css).toEqual('a { color: red; }')
    expect(result.warnings()).toHaveLength(0)
  }
))
