---
layout: post
title: "For me only"
tags: [Others]
icon: "/img/header/customize.svg"
keywords: "for me only customize edit this site box font blocks"
toc: true
---

This post is for me only. It contains shortcodes to create this website.

## Frontmatter

``` yaml
layout: post # or `page` or `base`
title: "For me only"
tags: [Others] # base: Project-based Learning, MOOC, Machine Learning,
               #       Data Science, Deep Learning, Time Series,
               #       NLP, MLOps, Python, R Lang, Linear Algebra,
               #       Prob & Stats, JavaScript, Web Dev, Algorithms
               #       Skills, Others
icon: "/img/header/customize.svg" # can be "customize.svg"
                                  # if it's in /img/header/
keywords: "for me only customize edit this site box font blocks" # used for searching
toc: true # `false` to hide toc
notfull: true # if the post is not good enough
```

## Other components

### Ref

``` bash {% raw %}
{% ref "url" %} # should use with ""
{% endraw %}
```

```
Testing
```

### Color inline text

``` bash
{color:red}text{color} # without space
```

## Insert figures

``` markdown
# With custom class
![description](/path/to/figure){:.img-full-100}
# There are class .img-full-{number}
# where, {number} are 30 to 100, step 5.
```

### Default img path

``` bash {% raw %}
{% assign img-url = '/img/post/python' %}
{% endraw %}
```

## Inser codes

::: code-2cols
~~~ markdown
# Highlight line 2
``` js/2
// lines of codes
```
~~~

~~~ markdown
# Highlight line 2 to 4
``` js/2-4
// lines of codes
```
~~~

~~~ markdown
# Highlight line 2, 4
``` js/2,4
// lines of codes
```
~~~
:::

~~~ markdown
# Delete line 2 (red highlight) and add line 4 (green highlight)
``` js/4/2
// lines of codes
```
~~~

### Raw code


``` bash
~~~ js {{ "{% raw " }}%}
# line of codes
{{ "{% endraw " }}%}
~~~
```

## Columns

### Code & output

- Equal widths: `::: code-output-equal`.
- Flexible widths: `::: code-output-flex`.

### Two columns

- Equal widths: `::: col-2-equal`.
- Flexible widths: `::: col-2-flex`.

## Boxes

### Hide / Show box

``` js
// The box must have a title
::: hsbox Title Name
Content
:::
```

### Alert boxes

<div class="code-2cols">

``` js
// info
::: info
Content
:::
```

``` js
// warning
::: warning
Content
:::
```

``` js
// danger
::: danger
Content
:::
```

``` js
// success
::: success
Content
:::
```
</div>

## Dev

### Locally developing mode

We can use a different config file (instead of `.eleventy.js`).

``` js
npm run eleventy --config=.eleventy.dev.js
```

Other command lines can be found [here](https://www.11ty.dev/docs/usage/#command-line-usage) or using `npx @11ty/eleventy --help`.

### PurgeCSS

Becare full on [PurgeCSS](https://purgecss.com/),

``` css
/*! purgecss start ignore */
// css classes
/*! purgecss end ignore */
```

### Custom tags / shortcodes

The main guide is [here](https://www.11ty.dev/docs/shortcodes/).

``` js
// In .eleventy.js
module.exports = function(eleventyConfig) {
	eleventyConfig.addShortcode("ref", function(url) {
    return '<a href="' + url + '">[ref]</a';
  });
}
```

Usage,

``` js {% raw %}
{% ref https://dinhanhthi.com %}
{% endraw %}
```

### Custom classes

Usage,

``` markdown
# paragraph
A pragraph{:.custom-class}

# image
![](){:.custom-class}
```

Example with tables,

``` markdown
{:.custom-class}
# table
```

We define CSS like that,

``` scss
p.custom-class + table{}
// and
p.custom-class{display: none;}
// instead of
table.custom-class{}
```