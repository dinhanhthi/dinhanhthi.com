---
layout: post
title: "Python List"
categories: [python]
icon-photo: list.png
---

{% assign img-url = '/img/post/python' %}

{% include toc.html %}

{% updfreq %}

## General

- Index starts with `0`.
- Slice: `x[1:4]` gives elements from `x[1]` to `x[3]` inclusive (takes `1`, not `4`).
- `x[:3] + x[3:]` gives exactly `x`.

## Properties

**Ordered** (different order, different list):

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
x = [1, 2]
y = [1, 2]
z = [2, 1]

x == y
x == z
~~~

{:.output.flex-fill.d-flex}
~~~ 
True
False
~~~
</div>

**Mutable** (we can change elements in list),

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
x = [1, 2, 3]
x[1] = 5
print(x)

# change mutiple elements
y = [1, 2, 3, 4, 5]
y[1:3] = [20, 30]
print(y)
~~~

{:.output.flex-fill.d-flex}
~~~ 
[1, 5, 3]
[1, 20, 30, 4, 5]
~~~
</div>

## Create a list

Directly,

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
x = [1, "Thi", 3] # mixed datatypes
y = [[1, 2, 3],
     [4, 5, 6]] # nested list
z = [] # empty list

print(x)
print(y)
print(z)
~~~

{:.output.flex-fill.d-flex}
~~~ 
[1, 'Thi', 3]
[[1, 2, 3], [4, 5, 6]]
[]
~~~
</div>

From other types,

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
a = (1, 2, 3) # tuple
x = list(a)

print(a)
print(x)
~~~

{:.output.flex-fill.d-flex}
~~~
(1, 2, 3)
[1, 2, 3]
~~~
</div>

With `for` (List comprehensions),

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
x = [i for i in range(4)]
print(x)
~~~

{:.output.flex-fill.d-flex}
~~~
[0, 1, 2, 3]
~~~
</div>

## Copy a list

Don't use `y = x` directly!

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
x = [1, 2, 3]
y = x
z = x.copy()
t = x[:]
u = list(x)

x[2] = 30 # x changes
print(x)
print(y) # y changes with x
print(z) # z doesn't change
print(t) # t doesn't change
print(u) # u doesn't change
~~~

{:.output.flex-fill.d-flex}
~~~
[1, 2, 30]
[1, 2, 30]
[1, 2, 3]
[1, 2, 3]
[1, 2, 3]
~~~
</div>

## Access elements

Normal list (1 dimensional),

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
x = [1, 2, 3, 4]

print(x[0]) # single index
print(x[:2]) # slice
print(x[-2]) # negative index
~~~

{:.output.flex-fill.d-flex}
~~~
1
[1, 2]
3
~~~
</div>

Nested list,

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
y = [[1, 2, 3],
     [4, 5, 6]]

print(y[0][1]) # single element
print(y[1]) # row 1
print([row[1] for row in y]) # column 1
~~~

{:.output.flex-fill.d-flex}
~~~
2
[4, 5, 6]
[2, 5]
~~~
</div>

## Get length

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
x = [1, 2, 3, 4]
y = [[1, 2, 3],
     [4, 5, 6]]

print(len(x))
print(len(y)) # number of rows
print(len(y[0])) # number of columns

import numpy as np
np.shape(y)
~~~

{:.output.flex-fill.d-flex}
~~~
4
2
3

(3,4)
~~~
</div>

## Add more elements

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
x = [1, 2, 3]

x.append(4) # single element
print(x)

x.extend([5, 6]) # another list
print(x)
~~~

{:.output.flex-fill.d-flex}
~~~
[1, 2, 3, 4]
[1, 2, 3, 4, 5, 6]
~~~
</div>

Add to desired positions,

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
x = [1, 2]
x.insert(30, 3)  # at 30th position --> add to the last
print(x)

y = [1, 2]
y.insert(1, 3)
print(y)
~~~

{:.output.flex-fill.d-flex}
~~~
[1, 2, 3]
[1, 3, 2]
~~~
</div>

With slices (it likes the intersection between indexes of the current list with indexes indicated in the slice):

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
x = [1, 2]
x[5:7] = [3, 4]
print(x)

y = [1, 2]
y[2:2] = [3, 4, 5]
print(y)
~~~

{:.output.flex-fill.d-flex}
~~~
[1, 2, 3, 4]
[1, 2, 3, 4, 5]
~~~
</div>

## Remove elements

Using the keyword `del`:

<div class="d-lg-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
x = [1, 2, 3, 4, 5]
print(x)

del x[1]
print(x)

del x[:2]
print(x)

del x  # delete entire list
print(x)
~~~

{:.output.flex-fill.d-flex}
~~~
[1, 2, 3, 4, 5]
[1, 3, 4, 5]
[4, 5]
NameError: name 'x' is not defined
~~~
</div>

Using `.remove()` to remove **a value** in list (it removes the **first found value**):

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
x = [1, 2, 3, 4, 3]
x.remove(3) # remove the first found value "3"
print(x)
~~~

{:.output.flex-fill.d-flex}
~~~
[1, 2, 4, 3]
~~~
</div>

If you wanna remove **all specific value** from a list:

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
x = [1, 2, 3, 4, 3]
x = [i for i in x if i != 3]
print(x)
~~~

{:.output.flex-fill.d-flex}
~~~
[1, 2, 4]
~~~
</div>

Using `.pop()` to remove and **return the deleted element**.

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
x = [1, 2, 3, 4]
y = x.pop(2)  # delete at 2nd position
print(x)
print(y)

z = x.pop()  # delete the last element
print(x)
print(z)
~~~

{:.output.flex-fill.d-flex}
~~~
[1, 2, 4]
3
[1, 2]
4
~~~
</div>

Using `.clear()` to empty a list:

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
x = [1, 2, 3]
x.clear()
print(x)
~~~

{:.output.flex-fill.d-flex}
~~~
[]
~~~
</div>

Special case, using a empty list:

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
x = [1, 2, 3, 4]
x[1:3] = []
print(x)
~~~

{:.output.flex-fill.d-flex}
~~~
[1, 4]
~~~
</div>

## Coupling 2 lists

Using `+` and `*`,

<div class="d-lg-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
x = [1, 2, 3]
print(x + [4, 5, 6])
print(["re"] * 3)
~~~

{:.output.flex-fill.d-flex}
~~~
[1, 2, 3, 4, 5, 6]
['re', 're', 're']
~~~
</div>

## Sort a list

Return a sorted list but not change the list:

<div class="d-lg-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
x = [1, 5, 3, 2, 4]
print(sorted(x)) # ASC
print(sorted(x, reverse=True)) # DESC
print(x) # x doesn't change
~~~

{:.output.flex-fill.d-flex}
~~~
[1, 2, 3, 4, 5]
[5, 4, 3, 2, 1]
[1, 5, 3, 2, 4]
~~~
</div>

Sort and change a list:

<div class="d-lg-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
x = [1, 5, 3, 2, 4]
x.sort() # return None, ASC
print(x) # x does change
x.sort(reverse=True) # DESC
print(x)
~~~

{:.output.flex-fill.d-flex}
~~~
[1, 2, 3, 4, 5]
[5, 4, 3, 2, 1]
~~~
</div>

## Reverse a list

<div class="d-lg-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
x = [1, 2, 3, 4]
y = x[::-1] # x doesn't change
print(x)
print(y)
x.reverse() # x changes
print(x)
~~~

{:.output.flex-fill.d-flex}
~~~
[1, 2, 3, 4]
[4, 3, 2, 1]
[4, 3, 2, 1]
~~~
</div>

## Map a function to each element

If you wanna apply a function to each element in an iterable:

<div class="d-lg-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
square = lambda x: x * 2
x = [1, 2, 3, 4] # can be tuple or other iterable
y = map(square, x) # return a map object
print(list(y))
~~~

{:.output.flex-fill.d-flex}
~~~
[1, 4, 9, 16]
~~~
</div>

## Get indexes and values with for

<div class="d-lg-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
courses = ['a', 'b', 'c']
for idx, val in enumerate(courses, start=1):
    print(idx, val)
~~~

{:.output.flex-fill.d-flex}
~~~
1 a
2 b
3 c
~~~
</div>

## Other methods

- `.index(<e>)`: Returns the index of the first matched item `<e>`.
- `.count(<e>)`: Returns the number of item `<e>` in list.