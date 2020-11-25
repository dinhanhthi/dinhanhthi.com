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
```

## Inser codes

<div class="code-2cols">

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

## Columns

### Code & output

<div class="code-2cols">

``` js
// equal width
::: code-output-equal
// block of code

// block of output (also a block of code)
:::
```

``` js
// flexible width
::: code-output-flex
// block of code

// block of output (also a block of code)
:::
```
</div>

### 2 equal columns of code boxes

``` js
::: code-2cols
// code block 1

// code block 2

// code block 3
:::
```

## Boxes

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

Becare full on [PurgeCSS](https://purgecss.com/),

``` css
/*! purgecss start ignore */
// css classes
/*! purgecss end ignore */
```