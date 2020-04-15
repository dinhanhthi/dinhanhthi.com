---
layout: post
title: "Python Tuple"
categories: [python]
tags: ['101', python]
notfull: 1
icon-photo: tuple.svg
keywords: ""
---

{% assign img-url = '/img/post/python' %}

{% include toc.html %}

## Check

~~~ python
# a tuple has None / empty value
not all(mytuple) # None ~ 0 ~ O.0

# only consider None
any(map(lambda x: x is None, mytuple)
~~~