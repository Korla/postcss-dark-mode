const { shortHexa, longHexa, rgb } = require('./regex');

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

it('rgb', () => {
  const regex = rgb;
  expect('rgb(1,1,1)'.match(regex)).toEqual(['rgb(1,1,1)']);
  expect('rgb(1,1,1);'.match(regex)).toEqual(null);
  expect('rgba(1,1,1);'.match(regex)).toEqual(null);
});
