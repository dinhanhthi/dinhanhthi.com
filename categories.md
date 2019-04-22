---
layout: page
title: Topics
subtitle: The main subjects I write about
icon: fas fa-folder-open
color: "#ffeead"
permalink: /categories
---


{% for category in site.categories %}
  {% capture category_name %}{{ category | first }}{% endcapture %}
  <h2 id="{{category_name | replace: " ","_"}}">{{ category_name }}</h2>
  <ul class="books">
    {% for item in site.categories[category_name] %}
      <li class="item">
        <span class="title">
          <a href="{{item.url}}">{{item.title}}</a>
        </span>
        <span class="author"> &mdash; {{ item.date | date_to_string }}.</span>
      </li>
    {% endfor %}
  </ul>
{% endfor %}
