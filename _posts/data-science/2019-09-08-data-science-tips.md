---
layout: post
title: "Data Science Tips"
categories: [data science]
math: 1
keywords: fake data graphviz
---

{% assign img-url = '/img/post/ML/data-tips' %}

{% include toc.html %}

## Create some fake data w.r.t. a function

<div class="columns-2" markdown="1">
~~~ python
# f(x) = log(x)
import numpy as np
x = np.random.uniform(1, 100, 1000)
y = np.log(x) + np.random.normal(0, .3, 1000)
~~~

{:.img-full-75.pop}
![Fake data w.r.t. log function]({{img-url}}/log_with_noise.png)
</div>

## Graphviz export

- Download **Graphviz** [here](https://graphviz.gitlab.io/download/). 
- Its [online version](http://webgraphviz.com/).
