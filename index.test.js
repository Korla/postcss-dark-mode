const postcss = require('postcss');
const plugin = require('./');

const run = (input, opts, resultCallback) => () =>
  postcss([plugin(opts)])
    .process(input)
    .then(resultCallback);

it(
  'Maps colors using the color map',
  run(`a { color: #ffe; }`, { '#ffe': 'red' }, result => {
    expect(result.css).toEqual('a { color: red; }');
    expect(result.warnings()).toHaveLength(0);
  })
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

it(
  'Will warn if mapping is missing and not keep the declaration',
  run(
    `a { color: #ffe; background-color: #ffeeff; }`,
    { '#ffeeff': 'blue' },
    result => {
      const warnings = result.warnings();
      expect(warnings).toHaveLength(1);
      expect(warnings[0].text).toEqual(
        `Color '#ffe' lacks mapping (Rule: 'a { color: #ffe; background-color: #ffeeff; }')`
      );
      expect(result.css).toEqual('a { background-color: blue; }');
    }
  )
);
