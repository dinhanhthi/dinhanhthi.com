---
layout: post
title: "Web Design extra"
categories: [web development]
keywords: "autofocus separated columns page load google webfont sass Font ligatures terms"
---

{% assign img-url = '/img/post/web-dev' %}

{% include toc.html %}

## Terms

- **Font ligatures**: When you type <kbd>=</kbd> + <kbd>></kbd>, it becomes `⇒`.

## Auto focus on an input field when page loads

Just add `autofocus` into the `<input>` tag.

~~~ html
<input name="q" class="search" type="search" placeholder="..." autofocus>
~~~

## Separate a list into 2 columns

And make it into 1 if the screen is small.

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto.pr-md-1}
~~~ html
<div class="two-columns-list">
  <ul>
    <li></li>
  </ul>
</div>
~~~

{:.flex-fill.d-flex.pl-md-1}
~~~ css
.two-columns-list{
  -webkit-columns: 384px 2;
  -moz-columns: 384px 2;
  columns: 350px 2;
}
~~~
</div>

## Other useful Tools

- **Mario Ranftl** -- [google-webfonts-helper](https://google-webfonts-helper.herokuapp.com/fonts) -- A Hassle-Free Way to Self-Host Google Fonts -- giving us font files and font-face declarations based on the fonts, charsets, styles, and browser support you select.

## Useful URLs

- **Sia Karamalegos** -- [Making Google Fonts Faster](https://medium.com/clio-calliope/making-google-fonts-faster-aadf3c02a36d).
- **The SASS way** -- [If-For-Each-While in SCSS](http://thesassway.com/intermediate/if-for-each-while).