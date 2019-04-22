---
layout: page
title: Tags
subtitle: The sub-topics I write about
icon: fas fa-tags
color: "#ffeead"
permalink: /tags
---


{% for tag in site.tags %}
  {% capture tag_name %}{{ tag | first }}{% endcapture %}
  <h2 id="{{tag_name | replace: " ","_"}}">{{ tag_name }}</h2>
  <ul class="books">
    {% for item in site.tags[tag_name] %}
      <li class="item">
        <span class="title">
          <a href="{{item.url}}">{{item.title}}</a>
        </span>
        <span class="author"> &mdash; {{ item.date | date_to_string }}.</span>
      </li>
    {% endfor %}
  </ul>
{% endfor %}
