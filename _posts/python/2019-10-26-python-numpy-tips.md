---
layout: post
title: "Numpy tips"
categories: [python]
icon-photo: numpy.png
---

{% assign img-url = '/img/post/python' %}

{% include toc.html %}

{% updfreq %}

## Import library

~~~ python
import numpy as np
~~~

## Creating

🔥 Create **evenly spaced numbers** over a specified interval{% ref https://docs.scipy.org/doc/numpy/reference/generated/numpy.linspace.html %}

~~~ python
x = np.linspace(0, 3.5, num=20) # default num = 50
~~~

🔥 Create an array from nested arrays. Values in `array_2` are indexes in `array_1` and we create a new array take values in `array_1` which is corresponding to its indexes showed in `array_2`.

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
array_1 = np.array([ [0,0,0], [1,1,1], [2,2,2] ])
array_2 = np.array([1,0,2,1,0,2,1]) # indexes in array_1
array_3 = array_1[array_2]

print(array_1)
print(array_2)
print(array_3)
~~~

{:.output.flex-fill.d-flex}
~~~
[[0 0 0]
 [1 1 1]
 [2 2 2]]

[1 0 2 1 0]

[[1 1 1]
 [0 0 0]
 [2 2 2]
 [1 1 1]
 [0 0 0]]
~~~
</div>

