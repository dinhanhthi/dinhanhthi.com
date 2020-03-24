---
layout: post
title: "Python Loop"
categories: [python]
icon-photo: list.png
keywords: "python for while loop iteration skip ignore some iteration loop"
---

{% include toc.html %}

## Skip some step

~~~ python
# Create a range that does not contain 50
for i in [x for x in xrange(100) if x != 50]:
    print i
~~~

~~~ python
# Create 2 ranges [0,49] and [51, 100] (Python 2)
for i in range(50) + range(51, 100):
    print i
~~~

~~~ python
# Create a iterator and skip 50
xr = iter(xrange(100))
for i in xr:
    print i
    if i == 49:
        next(xr)
~~~

~~~ python
# Simply continue in the loop if the number is 50
for i in range(100):
    if i == 50:
        continue
    print i
~~~