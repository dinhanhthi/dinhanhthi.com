# DEV NOTES

## SCSS using rollup

Using plugin `rollup-plugin-scss`, note that, to use multiple rollup plugins,

``` js
import scss from 'rollup-plugin-scss';

export default [
  {
    // plugin 1
  },
  {
    input: 'css/main_input.js', // where the input file containing import of main.scss
    output: {
      file: 'css/main.js', // intermediate file which can be translated to css/main.css
      format: 'esm' // still not know
    },
    plugins: [
      scss() // there are other configs
    ]
  }
];
```