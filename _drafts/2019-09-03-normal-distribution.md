---
layout: post
title: "Normal Distribution & t-distribution"
categories: [probability & statistics]
---

{% assign img-url = '/img/post/stats' %}

{% include toc.html %}

## Normal distribution with python

Create a raw random samples from a normal distribution{% ref https://docs.scipy.org/doc/numpy-1.15.0/reference/generated/numpy.random.normal.html %},

~~~ python
import numpy as np
np.random.normal(loc=0, scale=1.0, size=None)

# loc = mean, scale = sd, (size)
# returns ndarray/scalar
~~~

## References

- [My raw notes.](https://rawnote.dinhanhthi.com/stats-1#normal-distribution-continuous)
- [t-distribution wiki](https://en.wikipedia.org/wiki/Student%27s_t-distribution)


