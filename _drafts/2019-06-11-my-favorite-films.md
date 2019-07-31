---
layout: post
title: "My favorite films"
subtitle: Not only funny but also meaningful!
description: "Not only funny but also meaningful!"
tags: [collection]
categories: [others]
comment: 1
writing: 1
---

{% assign img-url = '/img/post/others' %}

I have a special interest in movies, especially with the ones that have unpredictable ending, many twists and original idea. Many of below introductions are taken from the corresponding wikipedia/imdb pages.

## Movies

<ul class="books">
  {% for item in site.data.film %}
    {% if item.type == "movie" %}
      <li class="item">
        <span class="title">
          {% if item.url %}
            <a href="{{item.url}}" target="_blank">{{item.title}}</a>
          {% else %}
            {{item.title}}
          {% endif %}
        </span>
        <span class="author"> &mdash; {{item.year}}, imdb: {{item.imdb}}.</span>
        {% if item.comment %}
          <span>{{item.comment}}</span> 
        {% endif %}
        {% if item.intro %}
          <span class="intro"><i>{{item.intro}}</i></span>
        {% endif %}
      </li>
    {% endif %}
  {% endfor %}
</ul>


## Series

<ul class="books">
  {% for item in site.data.film %}
    {% if item.type == "series" %}
      <li class="item">
        <span class="title">
          {% if item.url %}
            <a href="{{item.url}}" target="_blank">{{item.title}}</a>
          {% else %}
            {{item.title}}
          {% endif %}
        </span>
        <span class="author"> &mdash; {{item.year}}, imdb: {{item.imdb}}.</span>
        {% if item.comment %}
          <span>{{item.comment}}</span> 
        {% endif %}
        {% if item.intro %}
          <span class="intro"><i>{{item.intro}}</i></span>
        {% endif %}
      </li>
    {% endif %}
  {% endfor %}
</ul>

