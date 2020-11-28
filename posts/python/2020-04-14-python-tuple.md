---
layout: post
title: "Python Tuple"
tags: [Python]
toc: false
icon: "/img/about/python.svg"
notfull: 1
keywords: ""
---

{% assign img-url = '/img/post/python' %}

## Check

~~~ python
# a tuple has None / empty value
not all(mytuple) # None ~ 0 ~ O.0

# only consider None
any(map(lambda x: x is None, mytuple)
~~~