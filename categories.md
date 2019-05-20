---
layout: page
title: Topics
subtitle: The main subjects I write about
icon: fas fa-folder-open
color: "#ffeead"
permalink: /categories
---

<div class="tag-list">
  {% for category in site.categories %}
    {% capture category_name %}{{ category | first }}{% endcapture %}
    <a class="tag" href="#{{category_name | replace: " ","_"}}">{{ category_name }}</a>
  {% endfor %}
</div>

{% for category in site.categories %}
  {% capture category_name %}{{ category | first }}{% endcapture %}
  <div class="tag-item" id="{{category_name | replace: " ","_"}}">
    <h2>{{ category_name }}</h2>
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
  </div>
{% endfor %}
