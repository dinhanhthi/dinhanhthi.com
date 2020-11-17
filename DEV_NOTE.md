# DEV NOTES

## Test cases

Test cases are stored in `/test/`.

## Include

``` js
// in _includes/components/head.njk
{% include "components/head.njk" %}
```

## Watch SCSS

``` js
// rollup.config.js
export default [{
    input: 'css/main_input.js',
    output: {
      file: 'css/main.js',
      format: 'esm'
    },
    plugins: [
      scss({
        watch: ['css/components', 'css'], // <-- this one!
      })]
}];
```

## Template inheritance

Read [this tutorial](https://mozilla.github.io/nunjucks/templating.html#template-inheritance).

``` njk
{% extends "parent.html" %}
{% block left%}{% endblock %}
```

## Auto perform something before `git push`

``` json
{
  "pre-push": [
    "build"
  ],
}
```

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

## Issues

``` js
// Problem of "Content-Security-Policy" (CSP)
// _data/csp.js
const CSP = {
  regular: serialize([
    // Inline CSS is allowed.
    ["style-src", SELF, "https://fonts.googleapis.com/", quote("unsafe-inline")],
    ["font-src", SELF, "https://fonts.gstatic.com/"],
  ]),
};

// equivalent phrase (put in <head>)
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; font-src 'self' https://fonts.gstatic.com/; style-src 'self' https://fonts.googleapis.com/ 'unsafe-inline';">
// quote() -> for '', e.g. 'self'
// "abc" -> doesn't mean 'abc' in <meta>
```

