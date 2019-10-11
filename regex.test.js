const { shortHexa, longHexa, rgb, rgba, hsl, hsla } = require('./regex');

it('Short hexa', () => {
  const regex = shortHexa;
  expect('#ffe'.match(regex)).toEqual(['#ffe']);
  expect(' #ffe'.match(regex)).toEqual(['#ffe']);
  expect('#ffe;'.match(regex)).toEqual(null);
  expect('#ffeeff'.match(regex)).toEqual(null);
});

it('Long hexa', () => {
  const regex = longHexa;
  expect('#ffeeff'.match(regex)).toEqual(['#ffeeff']);
  expect(' #ffeeff'.match(regex)).toEqual(['#ffeeff']);
  expect('#ffeeff;'.match(regex)).toEqual(null);
  expect('#ffe'.match(regex)).toEqual(null);
});

it('rgb', () => {
  const regex = rgb;
  expect('rgb(1,1,1)'.match(regex)).toEqual(['rgb(1,1,1)']);
  expect(' rgb(1,1,1)'.match(regex)).toEqual(['rgb(1,1,1)']);
  expect('rgb(1,1,1);'.match(regex)).toEqual(null);
  expect('rgba(1,1,1);'.match(regex)).toEqual(null);
});

it('rgba', () => {
  const regex = rgba;
  expect('rgba(1,1,1)'.match(regex)).toEqual(['rgba(1,1,1)']);
  expect(' rgba(1,1,1)'.match(regex)).toEqual(['rgba(1,1,1)']);
  expect('rgba(1,1,1);'.match(regex)).toEqual(null);
  expect('rgb(1,1,1);'.match(regex)).toEqual(null);
});

it('hsl', () => {
  const regex = hsl;
  expect('hsl(1,1,1)'.match(regex)).toEqual(['hsl(1,1,1)']);
  expect(' hsl(1,1,1)'.match(regex)).toEqual(['hsl(1,1,1)']);
  expect('hsl(1,1,1);'.match(regex)).toEqual(null);
  expect('hsla(1,1,1);'.match(regex)).toEqual(null);
});

it('hsla', () => {
  const regex = hsla;
  expect('hsla(1,1,1)'.match(regex)).toEqual(['hsla(1,1,1)']);
  expect(' hsla(1,1,1)'.match(regex)).toEqual(['hsla(1,1,1)']);
  expect('hsla(1,1,1);'.match(regex)).toEqual(null);
  expect('hsl(1,1,1);'.match(regex)).toEqual(null);
});
