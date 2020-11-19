# DEV NOTES

## Markdown with HTML

HTML tags inside a markdown file,

``` markdown
// no working
<div>
__abc__
</div>

// working
<div>

__abc__
</div>
```

``` markdown
// not working
<div class="list-of">
    {% for item in cv.education.list %}
        <div class="where">{{ item.where }}</div>
        <div class="title">{{ item.title }}</div>
        <div class="date">{{ item.date }}</div>
    {% endfor %}
</div>

// working
<div class="list-of">
{% for item in cv.education.list %}
<div class="where">{{ item.where }}</div>
<div class="title">{{ item.title }}</div>
<div class="date">{{ item.date }}</div>
{% endfor %}
</div>
```



Markdown inside HTML,

``` js
// .eleventy.js
eleventyConfig.addPairedShortcode("markdown", (content, inline = null) => {
    return inline
        ? markdownIt.renderInline(content)
    : markdownIt.render(content);
});

// markdown
{% markdown %}
// I can write *markdown* in this paired shortcode…
{% endmarkdown %}
```



## JSON data file

- Using [this tool](https://onlineyamltools.com/convert-yaml-to-json) to convert YML / YAML to JSON.
- Quite alike to jekyll's.
- Put `.json` data file to `_data/categories.json`

``` json
[
   {
      "name": "Project-based Learning",
      "icon": "fas fa-project-diagram",
      "color": "#e97c8e"
   },
   {
      "name": "MOOC",
      "icon": "fas fa-laptop-code",
      "color": "#fdcb6e"
   },
   {
      "name": "Machine Learning",
      "icon": "fas fa-robot",
      "color": "#84f9ff"
   },
]
```

Then in any place, use

``` html
{% for item in categories %}
	{{ item.name }}
{% endfor %}
```

## Filters

List of buit-in filters in Nunjucks: [here](https://mozilla.github.io/nunjucks/templating.html#builtin-filters).

Custom filter in 11ty: [here](https://www.11ty.dev/docs/filters/).

``` bash
// to lower case
{{ item | lower }}
// to upper case
{{ item | upper }}
```

## Test cases

Test cases are stored in `/test/`.

## Frontmatter

``` php+HTML
# index.html
​```
header: homepage
​```

# used in layout.njk
{{ header }}
# not like jekyll ({{ page.header }})
```

However, below keys are default in 11ty

``` html
{{ page.url }} {{ page.date }} ...
```

## Favicon

``` php+HTML
// png
<link rel="icon" href="{{ '/img/favicon/favicon-192x192.png' | addHash }}" type="image/png">
```

## Google fonts

- Put fonts in `fonts/` and use [this tool](http://google-webfonts-helper.herokuapp.com/fonts/open-sans?subsets=latin) to generate `.woff`, `woff2` from Google Fonts.
- If you have a problem with `Content-Security-Policy`, check section [Issuses](#issues).

## Include

``` js
// in _includes/components/head.njk
{% include "components/head.njk" %}

// custom parameter
{% set customClass = 'list-homepage' %}
{% include "postslist.njk" %}
// inside postlist.njk, just use {{ customClass }}
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

## SCSS using rollupIssuses

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

