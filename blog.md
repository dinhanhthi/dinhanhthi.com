---
layout: page
title: Knowledge under my eyes
subtitle: If you can't explain it simply, you don't understand it well enough.
nav: blog
icon: fab fa-leanpub
color: "#aafdb5"
permalink: /blog
---

{:.p-intro}
These articles are written **after** I learn something with a deeper study besides the courses. They are more well-structured than [these instant notes](https://mynote.dinhanhthi.com){:target="_blank"} which are taken during the courses.

<ul class="books">
{% for item in site.posts %}
  <li class="item">
    <span class="title">
      <a href="{{item.url}}">{{item.title}}</a>
    </span>
    <span class="author"> &mdash; {{ item.date | date_to_string }}.</span>
    <span class="intro">{{item.description}}</span>
  </li>
{% endfor %}
</ul>


