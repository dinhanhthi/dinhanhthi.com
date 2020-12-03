---
layout: post
title: "For me only"
tags: [Others]
toc: true
icon: "/img/header/customize.svg"
keywords: "for me only customize edit this site box font blocks"
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
hide: true # if don't want to show it on index
```

## Other components

- Mark: `==Text==`.
- Keyboard: `[[Ctrl]]`.
- Reference: `{%raw%}{% ref "url" %}` (mush have `""`).
- Inline text color: `{color:red}text{color}` (without space)
- `{:.noindent}` before a list, not indent a list.
- `{:.indent}` before a list, indent a list.
- `{:target="_blank"}` after an url.

## Insert figures

``` markdown
# NORMAL WITH CUSTOM CLASS
![description](/path/to/figure){:.img-full-100}
# There are class .img-full-{number}
# where, {number} are 30 to 100, step 5.
```

``` markdown
# WITH DESCRIPTION
![description](/path/){:.custom-class}
__Description texts__
```

### Background white

``` bash
![Description](/path/to){:.bg-white}
# with other classes?
{:.bg-white .custom-class}
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

### Code inside a list

For problems with tab/spaces in markdown rendering.

~~~ bash {% raw %}
1. Item # below is a blank line

  ``` bash
  # codes with 2 spaces (as tab indented)
  ```
2. Another item.

  ``` bash
  # code
  ```
{% endraw %}
~~~

## Columns

### Content - figure / table

Using class `columns-2`,

``` html
<div class="columns-2" markdown="1">
<div>

Content containing markdown blocks
</div>

![Description](/path/to/figure){:.custom-class}
</div>
```

There are also others: `.columns-2.size-2-1` (`1-2`, `3-2`, `2-3`, `1-1`).

### Two cols list

``` html
<div class="col-2-list">

<!-- list (a line break above is required!) -->
</div>
```

### Code & output

- Equal widths: `::: code-output-equal`.
- Flexible widths: `::: code-output-flex`.

### Two columns

``` html
<!-- flexible width -->
::: col-2-flex
```

``` html
<!-- 2 equal colmuns -->
<div class="col-2-equal">

Content
</div>

<!-- or use (not recommended) -->
::: col-2-equal
Content
:::
```

## Boxes

### Hide / Show box

``` js
// The box must have a title
::: hsbox Title Name
Content
:::
```

Or using liquid tag,

``` bash {% raw %}
{% hsbox "Long title" %}
# content
{% endhsbox %}
{% endraw %}
```

#### HSBox with indent

``` html {% raw %}
{% hsbox %}
- Item 1
- Item 2

  <div ><div class="hsbox">
	<div class="hs__title">
		More detail
	</div>
	<div class="hs__content">

  //code
  </div>
  </div>

  - Sub item.
- Item
{% endhsbox %}
{% endraw %}
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

## Math

If using with list and indent -> DON'T break line in math formulas,

::: col-2-equal
``` bash
# instead of
- Item

  $$
  \dfrac{1}{2}
  $$
- Item
```

``` bash
# use
- Item

  $$\dfrac{1}{2}$$ # ALl in 1 line
- Item
```
:::

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
A pragraph {:.custom-class}

# image
![](){:.custom-class}

# table
{:.custom-class}
table
```

__Multi-classes__: `{:.custom-1 .custom-2}` (with spaces)!

We define CSS like that,

``` scss
p.custom-class + table{}
// and
p.custom-class{display: none;}
// instead of
table.custom-class{}
```

### `.eleventy.dev.js` vs `.main.js`

The only difference is the line

``` js
// comment out in .dev.js
eleventyConfig.addPlugin(require("./_11ty/img-dim.js"));
```

### Build faster?

There is no `--incremental` feature in 11ty like Jekyll, we can add some folder of posts in `.eleventyignore` to not render these folders while writing other posts.

### Building index for search

If there is new post / keywords in some old posts -> remove line of `pages/search-index.json.njk` in `.eleventyignore`.

### Using markdown inside njk

Using `{% markdown %}{% endmarkdown %}` (no need spaces between content).

### Errors?

``` bash
# TypeError: Cannot read property 'type' of undefined
# => Class comes before ![]() of an image!
```

``` bash
# EISDIR: illegal operation on a directory
# Solution:
# Delete _site/ and rebuild!
```