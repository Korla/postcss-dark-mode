const postcss = require('postcss');
const plugin = require('./');

const run = (input, opts, resultCallback) => () =>
  postcss([plugin(opts)])
    .process(input)
    .then(resultCallback);

it(
  'Maps colors using the color map',
  run(`a { color: #ffe; }`, { darkmode: { '#ffe': 'red' } }, result => {
    expect(result.css).toEqual(
      'a { color: #ffe; }.theming-darkmode a { color: red; }'
    );
    expect(result.warnings()).toHaveLength(0);
  })
);

it(
  'Does not add theming for rules without color',
  run(
    `a { color: #ffe; } a:hover { text-decoration: underline; }`,
    { darkmode: { '#ffe': 'red' } },
    result => {
      expect(result.css).toEqual(
        'a { color: #ffe; }.theming-darkmode a { color: red; } a:hover { text-decoration: underline; }'
      );
      expect(result.warnings()).toHaveLength(0);
    }
  )
);

it(
  'Does not add declarations which lack color to theming rules',
  run(
    `a { color: #ffe; border-radius: 5px; }`,
    { darkmode: { '#ffe': 'red' } },
    result => {
      expect(result.css).toEqual(
        'a { color: #ffe; border-radius: 5px; }.theming-darkmode a { color: red; }'
      );
      expect(result.warnings()).toHaveLength(0);
    }
  )
);

it(
  'Handles multiple replace of the same type',
  run(
    `a { background: linear-gradient(left, #ffa 0%, #ffe 50%, #ffa 100%); }`,
    { darkmode: { '#ffe': 'red', '#ffa': 'blue' } },
    result => {
      expect(result.css).toEqual(
        'a { background: linear-gradient(left, #ffa 0%, #ffe 50%, #ffa 100%); }.theming-darkmode a { background: linear-gradient(left, blue 0%, red 50%, blue 100%); }'
      );
      expect(result.warnings()).toHaveLength(0);
    }
  )
);

test.skip(
  'Will not replace already replaced values',
  run(
    `a { background: linear-gradient(left, #ffa 0%, #ffe 100%); }`,
    { darkmode: { '#ffe': '#ffa', '#ffa': '#ffe' } },
    result => {
      expect(result.css).toEqual(
        'a { background: linear-gradient(left, #ffa 0%, #ffe 100%); }.theming-darkmode a { background: linear-gradient(left, #ffe 0%, #ffa 100%); }'
      );
      expect(result.warnings()).toHaveLength(0);
    }
  )
);

it(
  'Will warn if mapping is missing and not keep the declaration',
  run(
    `a { color: #ffe; background-color: #ffeeff; }`,
    { darkmode: { '#ffeeff': 'blue' } },
    result => {
      const warnings = result.warnings();
      expect(warnings).toHaveLength(1);
      expect(warnings[0].text).toEqual(
        `Color '#ffe' lacks mapping (Rule: 'a { color: #ffe; background-color: #ffeeff; }')`
      );
      expect(result.css).toEqual(
        'a { color: #ffe; background-color: #ffeeff; }.theming-darkmode a { background-color: blue; }'
      );
    }
  )
);

it(
  'Appends rules inside at-rules',
  run(
    `@media (min-width: 768px) { a { color: #ffe; } }`,
    { darkmode: { '#ffe': 'red' } },
    result => {
      expect(result.css).toEqual(
        '@media (min-width: 768px) { a { color: #ffe; } .theming-darkmode a { color: red; } }'
      );
      expect(result.warnings()).toHaveLength(0);
    }
  )
);

it('Can debug colors', () => {
  console.log = jest.fn();
  run(
    `@media (min-width: 768px) { a { color: #ffe; } }`,
    { darkmode: {}, debugColors: true },
    result => {
      expect(console.log.mock.calls).toHaveLength(1);
      expect(console.log.mock.calls[0][0]).toEqual(`{'#ffe': null,}`);
    }
  )();
});
