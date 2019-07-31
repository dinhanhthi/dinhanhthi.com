---
layout: post
title: "Python tricks 101"
subtitle: Simplicity makes perfect!
tags: [python]
categories: [coding]
comment: 1
math: 1
---

{% assign img-url = '/img/post/python' %}

{% include toc.html %}

This post is a collection of simple things but very helpful in Python. They are not my invention, they are just collected by me.

{:.subject}
## Swapping two variables value

~~~ python
a, b = b, a
~~~

{:.subject}
## Split a string into integer

~~~ python
# string = "1 2 3 4 5"
arr = [int(i) for i in string.split(" ")]
~~~


