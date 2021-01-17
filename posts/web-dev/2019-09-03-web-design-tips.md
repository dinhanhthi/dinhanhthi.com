---
layout: post
title: "Web Design extra"
tags: [Web Dev]
toc: true
icon: "/img/cats/web-dev.svg"
notfull: 1
keywords: "autofocus separated columns page load google webfont sass Font ligatures terms two 2 columns list Font ligatures auto convert symbol focus on input field google webfont helper regex regular expression font download media bootstrap doesn't work"
---

{% assign img-url = '/img/post/web-dev' %}

## Terms

- **Font ligatures**: When you type <kbd>=</kbd> + <kbd>></kbd>, it becomes `⇒`.

## Auto focus on an input field when page loads

Just add `autofocus` into the `<input>` tag.

~~~ html
<input name="q" class="search" type="search" placeholder="..." autofocus>
~~~

## Separate a list into 2 columns

And make it into 1 if the screen is small.

<div class="col-2-equal">

~~~ html
<div class="two-columns-list">
  <ul>
    <li></li>
  </ul>
</div>
~~~

~~~ scss
.two-columns-list {
  @media (min-width: $grid-md) {
    @include column-count(2);
    & > li {
      padding-right: 10px;
    }
  }
}
~~~
</div>

## `@media` not working

When I use bootstrap, the `@media` is not working when I change to mobile use, try to add below line to `<head>`,

``` html
<meta name="viewport" content="width=device-width" />
```


## Useful URLs

- **Sia Karamalegos** -- [Making Google Fonts Faster](https://medium.com/clio-calliope/making-google-fonts-faster-aadf3c02a36d).
- **The SASS way** -- [If-For-Each-While in SCSS](http://thesassway.com/intermediate/if-for-each-while).