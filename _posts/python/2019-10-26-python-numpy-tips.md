---
layout: post
title: "Numpy extra"
categories: [python]
tags: [python-data, extra, python]
icon-photo: numpy.png
keywords: "linspace array arange range equal spaces range arange int integer numbers list step evenly spaced create creating initialize nans values empty array random number isinstance check type numpy array compare 2 two dict dictionaries remove delete an element from an array"
---

{% assign img-url = '/img/post/python' %}

{% include toc.html %}

## Import library

~~~ python
import numpy as np
~~~

## Checking

Check if an object is an instance numpy array?

~~~ python
type(MyObect).__module__ == np.__name__
~~~

Compare 2 dicts of multiple objects:

~~~ python
def _compare_two_dict(dct_1, dct_2):
    return np.array([(lambda key: (dct_1[key] == dct_2[key]).all() 
       if type(dct_1[key]).__module__ == np.__name__ 
       else dct_1[key] == dct2[key])(key) 
       for key in dct_1]).all()
~~~

## Creating

### Random numbers

<div class="flex-auto-equal-2" markdown="1">
~~~ python
# random int between 0, 5
np.random.randint(5)

# random int between [1, 100]
np.random.randint(1, 100 + 1)
~~~

~~~ python
# random array of int between 1, 5
np.random.randint(1,5,size=(2,3))

# random array of int between 0, 3
np.random.randint(3,size=(2,3))
~~~

~~~ python
# random float number between [0, 1)
np.random.random()
~~~

~~~ python
# array of random between [0, 1)
np.random.random_sample((5,)) # size: 5x1
~~~

~~~ python
# betweeen (a, b)
(b - a) * random_sample() + a
~~~
</div>

### Equal size

Create **evenly spaced numbers** over a specified interval{% ref https://docs.scipy.org/doc/numpy/reference/generated/numpy.linspace.html %}

~~~ python
x = np.linspace(0, 3.5, num=20) # default num = 50
~~~

Range of int numbers

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
np.arange(0, 5)
np.arange(0, 31, 5)
~~~

{:.output.flex-fill.d-flex}
~~~
array([0, 1, 2, 3, 4])
array([ 0,  5, 10, 15, 20, 25, 30])
~~~
</div>

### Indexes and values in other arrays

Create an array from nested arrays. Values in `array_2` are indexes in `array_1` and we create a new array take values in `array_1` which is corresponding to its indexes showed in `array_2`.

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

### Array of NaN values

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
# single array
np.repeat(np.nan, 5)

# multi dimensional arrays
a = np.empty((2,3))
a[:] = np.nan
# other way
np.repeat([np.repeat(np.nan, 3)], 2, axis=0)
~~~

{:.output.flex-fill.d-flex}
~~~
array([nan, nan, nan, nan, nan])

array([[nan, nan, nan],
       [nan, nan, nan]])
~~~
</div>

## Deleting

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
# DELETE BY POSITIONS
arr = np.arange(6)
np.delete(arr, [3,4])
~~~

{:.output.flex-fill.d-flex}
~~~
array([0, 1, 2, 3, 4, 5])
array([0, 1, 2, 5])
~~~
</div>

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
# DELETE BY VALUES
a = np.array([1, 2, 3, 4, 5, 6])
np.delete(a, np.where(a == 3))

b = np.array([1, 2, 3, 'a'])
np.delete(a, np.where(b == 'a'))

# OR
a[a!=3]
b[b!='a']
~~~

{:.output.flex-fill.d-flex}
~~~
array([1, 2, 4, 5, 6])

array(['1', '2', '3'], dtype='<U21')
~~~
</div>

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
# Remove 'NaT' from an array
Y = np.array([600000, 300000, 'NaT'], 
              dtype='timedelta64[ns]')
Y[~np.isnat(Y)]
~~~

{:.output.flex-fill.d-flex}
~~~
array([600000, 300000], 
       dtype='timedelta64[ns]')
~~~
</div>


