---
layout: post
title: "Web Design Tips"
categories: [web development]
math: 1
---

{% assign img-url = '/img/post/web-dev' %}

{% include toc.html %}

{% updfreq %}

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
