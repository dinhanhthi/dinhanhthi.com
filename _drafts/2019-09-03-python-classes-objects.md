---
layout: post
title: "Python Classes and Objects"
categories: [python]
---

{% assign img-url = '/img/post/python' %}

{% include toc.html %}

## Classes vs Objects vs Methods

- **Class**{:.tbrown} is a blueprint of an object.
- Each class has its own **attributes**{:.tbrown} and **methods**{:.tbrown} (its behaviors).
- Many **objects**{:.tbrown} may have the same class. They have attributes and methods defined in the class.

<div class="hide-show-box">
<button type="button" markdown="1" class="btn collapsed box-button" data-toggle="collapse" data-target="#box1ct">
An example
</button>
<div id="box1ct" markdown="1" class="collapse multi-collapse box-content">
A class `student` with:

- Attributes: `name`, `marks` and 
- Methods: `take_exams()`, `graduate()`.

Objects `john_doe` and `jane_doe` defined from class `student` will have:

- Their names: `john_doe.name` and `jane_doe.name`.
- Their marks: `john_doe.marks` and `jane_doe.marks`.
- Their behaviors: `john_doe.take_exams()` and `jane_doe.graduate()`, ...
</div>
</div>

