---
layout: post
title: "For me only"
tags: [Others, Static Site Generators, 11ty]
toc: true
icon: "/img_src/header/customize.svg"
keywords: "me for me only customize admin panel edition customize edit this site box font blocks for me only dinhanhthi dinh anh thi custom size emoji"
---

This post is for me only. It contains shortcodes to create this website.

👉  Note: [11ty](/11ty-nunjucks/).

## Frontmatter

``` yaml
layout: post # or `page` or `base`
title: "For me only"
descriptopm: description of the post
tags: [Others] # base: Project-based Learning, MOOC, Machine Learning,
               #       Data Science, Deep Learning, Time Series,
               #       NLP, MLOps, Python, R Lang, Linear Algebra,
               #       Prob & Stats, JavaScript, Web Dev, Algorithms
               #       Skills, Others
icon: "/img_src/header/customize.svg" # can be "customize.svg"
                                  # if it's in /img_src/header/
keywords: "for me only customize edit this site box font blocks" # used for searching
toc: true # `false` to hide toc
notfull: true # if the post is not good enough
hide: true # if don't want to show it on index
private: true # (if the post comes from external source) a private link
```

## Other components

- Mark: `==Text==`.
- Keyboard: `[[Ctrl]]`.
- Reference: `{%raw%}{% ref "url" %}` (mush have `""`).
- Inline text color: `{color:red}text{color}` (without space)
- `{:.noindent}` before a list, not indent a list.
- `{:.indent}` before a list, indent a list.
- `{:target="_blank"}` after an url.
- Using emoji: use [this site](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/full.json).

	``` bash
	👉 :point_right:
	🔅 :low_brightness:
	❓ :qusetion:
	❗ :exclamation:
	🇻🇳 :vietnam:
	```

## External post

In case you wanna add external posts to an existing category (e.g. post from Notion), just modify file `src/_data/cat_ex_posts.json`.

Files need to be changed for this sections:

``` bash
src/_data/cat_ex_position.json # posts (must have enough tags for each post)
index.njk # links to below file
src/_includes/postslist.njk
pages/tags.njk # tag page, also link to above file
pages/search-index.json # search-index.json, may change also .eleventy.js
```

## Insert figures

:point_right: Exclude from `img-dim` transform (when `update_dat`): add class `.keep-original` to the `img` tag!

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

<div class="col-2-equal">

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
</div>

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

::: col-2-equal
``` bash
# paragraph
A pragraph {:.custom-class}
```

``` bash
# image
![](){:.custom-class}
```

``` bash
# table
{:.custom-class}
table
```

``` bash
# heading
# Heading{:#heading-id}
```
:::

__Multi-classes__: `{:.custom-1 .custom-2}` (with spaces)!

We define CSS like that,

``` scss
p.custom-class + table{}
// and
p.custom-class{display: none;}
// instead of
table.custom-class{}
```

---

If using list based on "🔅",

``` html
<div class="p-list">

</div>
```

---

Is using list of things (like in [MacOS fresh installation note](/fresh-install-macos/#applications)), use `.list-item` class or,

``` html
::: list-item
Things
:::
```

### `.eleventy.dev.js` vs `.main.js`

The only difference is the line

``` js
// comment out in .dev.js
eleventyConfig.addPlugin(require("./src/_11ty/img-dim.js"));
```

### Building index for search

If there is new post / keywords in some old posts -> remove line of `pages/search-index.json.njk` in `.eleventyignore`.

### Using markdown inside njk

Using `{% raw %}{% markdown %}{% endmarkdown %}{% endraw %}` (no need spaces between content).

### Other vars of `page`

 Besise `page.url`, there are others at [here](https://www.11ty.dev/docs/data-eleventy-supplied/#page-variable-contents).

### Errors?

``` js
// Problem of "Content-Security-Policy" (CSP)
// src/_data/csp.js
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

---

``` js
// json-ld problem with latex code (math equations)
```

---

``` js {% raw %}
// ./pages/search-index.json.njk
// TypeError: Cannot read property 'svg' of undefined
// Idea: actually, there are some posts which don't have the right front matter
// Solution: try with below in .eleventy.js
eleventyConfig.addCollection("onlyMarkdown", function(collectionApi) {
	return collectionApi.getFilteredByGlob(["posts/*.*", "posts/others/*.md"]);
});
// and change in ./pages/search-index.json.njk
{{ collections.onlyMarkdown | search | dump | safe | striptags(true) | escape }}
{% endraw %}
```

**Reason**: `json-ld.js` takes some beginning words to convert to json formats! If there are equation (latex likes `$\Rightarrow$`) at the very beginning of the notes, there will be error like this!

The err comes from `src/json-ld.js` and the codes at the bottom of file `src/_includes/layouts/post.njk` $\Rightarrow$ `truncate(140)` $\Rightarrow$ If math equations start at character 141, it will be fine!

**Solution**: Add `| dump` to the `description` tag!

### Search full content

1. `.eleventy.js`: uncomment line `//"content": page.templateContent,`.
2. `src/main.js`: uncomment lines below `// use content??? ` & below `-- uncomment below if ...`