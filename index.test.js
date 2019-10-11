const postcss = require('postcss');
const plugin = require('./');

const run = (input, opts, resultCallback) => () =>
  postcss([plugin(opts)])
    .process(input)
    .then(resultCallback);

it(
  'Maps colors using the color map',
  run(
    `a { color: #ffe; border-radius: 5px; background-color: #ffeeff; box-shadow:2px 2px 0 rgb(1,1,1); -webkit-box-shadow:2px 2px 0 rgba(1,1,1); }`,
    {
      '#ffe': 'red',
      '#ffeeff': 'blue',
      'rgb(1,1,1)': 'rgb(27,27,27)',
      'rgba(1,1,1)': 'rgba(27,27,27)'
    },
    result => {
      expect(result.css).toEqual(
        'a { color: red; background-color: blue; box-shadow:2px 2px 0 rgb(27,27,27); -webkit-box-shadow:2px 2px 0 rgba(27,27,27); }'
      );
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

it(
  'Handles multiple replace of the same type',
  run(
    `a { background: -moz-linear-gradient(left, #ffa 0%, #ffe 50%, #ffa 100%); }`,
    { '#ffe': 'red', '#ffa': 'blue' },
    result => {
      expect(result.css).toEqual(
        'a { background: -moz-linear-gradient(left, blue 0%, red 50%, blue 100%); }'
      );
      expect(result.warnings()).toHaveLength(0);
    }
  )
);

it(
  'Will not replace already replaced values',
  run(`a { color: #ffe; border-radius: 5px; }`, { '#ffe': 'red' }, result => {
    expect(result.css).toEqual('a { color: red; }');
    expect(result.warnings()).toHaveLength(0);
  })
);
