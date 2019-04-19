---
layout: page
title: Open your mind with books
subtitle: Read to know we are not alone.
nav: reading
icon: fas fa-book-reader
color: "#d6baff"
permalink: /reading
---

{:.p-intro}
I like to read books in **applied maths**, **sciences**, **biography**, **history** and **psychology**. Check [my activities on Goodreads](https://www.goodreads.com/user/show/19630622-thi-dinh) (to-read books, comments, ratings,...) for more information.

<ul class="books">
{% for item in site.data.book %}
  <li class="item">
    {% if item.reading %}
      <span class="badge-green">I'm reading</span>
    {% endif %}
    <span class="title">
      {% if item.goodreads %}
        <a href="{{item.goodreads}}">{{item.title}}</a>
      {% else %}
        {{item.title}}
      {% endif %}
    </span>
    <span class="author"> &mdash; {{item.author}}.</span>
    <span class="intro">{{item.intro}}</span>
  </li>
{% endfor %}
<li><i>and <a href="https://www.goodreads.com/review/list/19630622-thi-dinh?shelf=read" target="_blank">many more</a> but I don't remember them much...</i></li>
</ul>


