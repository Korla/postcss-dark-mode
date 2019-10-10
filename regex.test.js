const { shortHexa, longHexa } = require('./regex');

it('Short hexa', () => {
  const regex = shortHexa;
  expect('#ffe'.match(regex)).toEqual(['#ffe']);
  expect('#ffe;'.match(regex)).toEqual(null);
  expect('#ffeeff'.match(regex)).toEqual(null);
});

it('Long hexa', () => {
  const regex = longHexa;
  expect('#ffeeff'.match(regex)).toEqual(['#ffeeff']);
  expect('#ffeeff;'.match(regex)).toEqual(null);
  expect('#ffe'.match(regex)).toEqual(null);
});
