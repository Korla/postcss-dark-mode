const postcss = require('postcss');
const plugin = require('./');
var fs = require('fs');

const exampleCss = fs.readFileSync('./examplecss.txt', 'utf8');
const run = (input, opts, resultCallback) =>
  postcss([plugin(opts)])
    .process(input)
    .then(resultCallback);
run(
  exampleCss,
  {
    debugColors: false,
    darkmode: {
      '#fff': '#1f1f24',
      '#f0f1f5': '#27272c',
      '#282828': '#fff',
      '#b0b0b0': '#56565b',
      'rgba(0,0,0,.25)': 'hsla(0,0%,100%,.25)',
      '#575757': '#afafb4',
      '#989898': '#97979c',
      '#282828': '#eff0f9', // 282828 -> fff flera förekomster
      '#e6e6e6': '#37373d',
      '#hsla(0,0%,100%,0)': '#rgba(31,31,36,0)',
      '#00FFFFFF': '#001F1F24',
      '#FFFFFFFF': '#FF1F1F24',
      '#000': '#fff',
      '#f0f1f5': '#27272c',
      '#f9f9f9': '#202023', //.tr-modal-header{background-color:#f9f9f9;position:relative} -> .tr-modal-header{background-color:#15202b;position:relative}
      e0e0e0: '040709',
      '0f0f0f': 'e6e6e6',
      'rgba(0,0,0,0.5)': 'hsla(0,0%,100%,0.5)'
    }
  },
  res => {
    console.log(res.warnings());
    fs.writeFileSync('./result.txt', res.css);
  }
);
