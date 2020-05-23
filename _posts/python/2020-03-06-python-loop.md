---
layout: post
title: "Python Loop"
categories: [python]
tags: ['101', python]
icon-photo: list.png
keywords: "python for while loop iteration skip ignore some iteration loop"
---

{% include toc.html %}

## `for`

<div class="d-md-flex" markdown="1">
{:.flex-even.d-flex.overflow-auto}
``` python
for i in range(3):
    print(i)
```

{:.output.flex-even.d-flex}
```
1
2
3
```
</div>

<div class="d-md-flex" markdown="1">
{:.flex-even.d-flex.overflow-auto}
``` python
for i in range(3):
    print(i)
else:
    print('no left')
```

{:.output.flex-even.d-flex}
```
0
1
2
no left
```
</div>

### Skip some step

<div class="flex-50" markdown='1'>
~~~ python
# don't contain 5 (way 1)
for i in [x for x in range(10) if x != 5]:
    print i
~~~

~~~ python
# don't contain 5 (way 2)
for i in list(range(5)) + list(range(6, 10)):
    print i
~~~

~~~ python
# next (skip 5)
xr = iter(range(10))
for i in xr:
    print(i)
    if i == 4: next(xr)
~~~

``` python
# continue (skip 5)
for i in range(10):
    if i == 5: continue
    print(i)
```
</div>

## `while`

<div class="d-md-flex" markdown="1">
{:.flex-even.d-flex.overflow-auto}
``` python
i = 1
while i < 4:
    print(i)
    i += 1
```

{:.output.flex-even.d-flex}
```
1
2
3
```
</div>

You can also use `next` and `continue` like in the case of `for` but with caution!

## `break`

<div class="d-md-flex" markdown="1">
{:.flex-even.d-flex.overflow-auto}
``` python
for i in range(6):
    print(i)
    if i==2: break
```

{:.output.flex-even.d-flex}
```
0
1
2
```
</div>

<div class="d-md-flex" markdown="1">
{:.flex-even.d-flex.overflow-auto}
``` python
i = 1
while i < 6:
    print(i)
    if i==3: break
    i += 1
```

{:.output.flex-even.d-flex}
```
1
2
3
```
</div>