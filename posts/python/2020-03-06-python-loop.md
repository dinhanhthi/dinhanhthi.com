---
layout: post
title: "Python Loop"
tags: [Python]
toc: false
icon: "/img/about/python.svg"
keywords: "python for while loop iteration skip ignore some iteration loop"
---

## `for`

::: code-output-flex
``` python
for i in range(3):
    print(i)
```

```
1
2
3
```
:::

::: code-output-flex
``` python
for i in range(3):
    print(i)
else:
    print('no left')
```

```
0
1
2
no left
```
:::

### Skip some step

<div class="col-2-equal">

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

::: code-output-flex
``` python
i = 1
while i < 4:
    print(i)
    i += 1
```

```
1
2
3
```
:::

You can also use `next` and `continue` like in the case of `for` but with caution!

## `break`

::: code-output-flex
``` python
for i in range(6):
    print(i)
    if i==2: break
```

```
0
1
2
```
:::

::: code-output-flex
``` python
i = 1
while i < 6:
    print(i)
    if i==3: break
    i += 1
```

```
1
2
3
```
:::