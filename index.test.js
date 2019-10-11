const postcss = require('postcss');
const plugin = require('./');

const run = (input, opts, resultCallback) => () =>
  postcss([plugin(opts)])
    .process(input)
    .then(resultCallback);

it(
  'Maps colors using the color map',
  run(
    `a { color: #ffe; border-radius: 5px; background-color: #ffeeff; box-shadow:2px 2px 0 rgb(1,1,1); }`,
    { '#ffe': 'red', '#ffeeff': 'blue', 'rgb(1,1,1)': 'rgb(27,27,27)' },
    result => {
      expect(result.css).toEqual('a { color: red; background-color: blue; box-shadow:2px 2px 0 rgb(27,27,27); }');
      expect(result.warnings()).toHaveLength(0);
    }
  )
);

it(
  'Removes rules which lack color declaraions',
  run(
    `a { color: #ffe; } a:hover { text-decoration: underline; }`,
    { '#ffe': 'red' },
    result => {
      expect(result.css).toEqual('a { color: red; }');
      expect(result.warnings()).toHaveLength(0);
    }
  )
);

it(
  'Removes declarations which lack color',
  run(`a { color: #ffe; border-radius: 5px; }`, { '#ffe': 'red' }, result => {
    expect(result.css).toEqual('a { color: red; }');
    expect(result.warnings()).toHaveLength(0);
  })
);
