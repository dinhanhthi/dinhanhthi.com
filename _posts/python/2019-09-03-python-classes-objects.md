---
layout: post
title: "Python Classes & Objects"
categories: [python]
keywords: "classes vs objects methods blueprint attributes import local class empty file __init__.py ValueError: attempted relative import beyond top-level package same folder subfolder another folder from incldue"
---

{% assign img-url = '/img/post/python' %}

{% include toc.html %}

Know to work with classes and objects in python.

## Classes vs Objects vs Methods

- **Class** is a blueprint of an object.
- Each class has its own **attributes** and **methods** (its behaviors).
- Many **objects** may have the same class. They have attributes and methods defined in the class.

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

## Import local class

Suppose that we have a folders/files structure like below,

<div class="d-md-flex" markdown="1">
{:.flex-even.overflow-auto.pr-md-1}
~~~ bash
# ORIGINAL STRUCTURE
popai/
  processings/
    a.py # contains class ABC
    test/
      b.py
  lib/
    c.py # contains class XYZ
~~~

{:.flex-even.overflow-auto.pl-md-1}
~~~ bash
# UPDATED STRUCTURE
popai/
  __init__.py
  processings/
    __init__.py
    a.py # contains class ABC
    test/
      __init__.py
      b.py
  lib/
    c.py # contains class XYZ
~~~
</div>

We want import both classes `ABC` and `XYZ`,

~~~ python
# b.py
from popai.processings.a import ABC

# a.py
from popai.lib.c import XYZ
~~~

Just add `__init__.py` like in the right box above.

Some errors may occur,

~~~ bash
ValueError: attempted relative import beyond top-level package
~~~



