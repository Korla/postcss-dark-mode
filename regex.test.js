const {
  shortHexa,
  longHexa,
  longestHexa,
  rgb,
  rgba,
  hsl,
  hsla
} = require('./regex');

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

it('LongestHexa hexa', () => {
  const regex = longestHexa;
  expect('#ffeeffff'.match(regex)).toEqual(['#ffeeffff']);
  expect(' #ffeeffff'.match(regex)).toEqual(['#ffeeffff']);
  expect('#ffeeffff;'.match(regex)).toEqual(null);
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
  expect('rgba(1,1,1,0.5)'.match(regex)).toEqual(['rgba(1,1,1,0.5)']);
  expect(' rgba(1,1,1,0.5)'.match(regex)).toEqual(['rgba(1,1,1,0.5)']);
  expect('rgba(1,1,1,0.5);'.match(regex)).toEqual(null);
  expect('rgb(1,1,1,0.5);'.match(regex)).toEqual(null);
});

it('hsl', () => {
  const regex = hsl;
  expect('hsl(0,0%,69%)'.match(regex)).toEqual(['hsl(0,0%,69%)']);
  expect(' hsl(0,0%,69%)'.match(regex)).toEqual(['hsl(0,0%,69%)']);
  expect('hsl(0,0%,69%);'.match(regex)).toEqual(null);
  expect('hsla(0,0%,69%,0.5));'.match(regex)).toEqual(null);
});

it('hsla', () => {
  const regex = hsla;
  expect('hsla(0,0%,69%,0.5)'.match(regex)).toEqual(['hsla(0,0%,69%,0.5)']);
  expect(' hsla(0,0%,69%,0.5)'.match(regex)).toEqual(['hsla(0,0%,69%,0.5)']);
  expect('hsla(0,0%,69%,0.5);'.match(regex)).toEqual(null);
  expect('hsl(0,0%,69%);'.match(regex)).toEqual(null);
});
