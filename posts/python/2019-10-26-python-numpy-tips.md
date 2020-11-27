---
layout: post
title: "Numpy extra"
tags: [Python]
toc: true
icon: "/img/header/numpy.png"
keywords: "linspace array arange range equal spaces range arange int integer numbers list step evenly spaced create creating initialize nans values empty array random number isinstance check type numpy array compare 2 two dict dictionaries remove delete an element from an array count nans non nans not null"
---

{% assign img-url = '/img/post/python' %}

## Import library

~~~ python
import numpy as np
~~~

## Checking

### Isinstance

~~~ python
# Check if an object is an instance numpy array?
type(MyObect).__module__ == np.__name__
~~~

### Comparing

Compare 2 dicts of multiple objects:

~~~ python
# 2 dicts of multiple objects
def _compare_two_dict(dct_1, dct_2):
    return np.array([(lambda key: (dct_1[key] == dct_2[key]).all()
       if type(dct_1[key]).__module__ == np.__name__
       else dct_1[key] == dct2[key])(key)
       for key in dct_1]).all()
~~~

``` python
# 2 numpy arrays containing `np.nan`
def nan_equal(a,b):
    try:
        np.testing.assert_equal(a,b)
    except AssertionError:
        return False
    return True

# if using in a pytest
# instead of `assert np.testing`,
# just use
np.testing.assert_equal(a,b)
```

### Count 0, NaNs

::: code-2cols
~~~ python
# count nans
arr = [1,2,3,4, np.nan,np.nan, 0,0,0]
np.isnan(arr).sum() # 2
~~~

~~~ python
# count non-nans
arr = [1,2,3,4, np.nan,np.nan, 0,0,0]
np.count_nonzero(~np.isnan(arr)) # 7
~~~

~~~ python
# count non-zeros
arr = [1,2,3,4, np.nan,np.nan, 0,0,0]
np.count_nonzero(arr) # 6
~~~
:::

## Creating

### Random numbers

::: code-2cols
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
# random float number between [a, b)
(b - a)*np.random.random() + a
~~~

~~~ python
# array of random between [0, 1)
np.random.random_sample((5,)) # size: 5x1
~~~

~~~ python
# array of random between (a, b)
(b - a)*np.random.random_sample((5,1)) + a
~~~
:::

### Equal size

Create **evenly spaced numbers** over a specified interval{% ref "https://docs.scipy.org/doc/numpy/reference/generated/numpy.linspace.html" %}

~~~ python
x = np.linspace(0, 3.5, num=20) # default num = 50
~~~

Range of int numbers

::: code-output-equal
~~~ python
np.arange(0, 5)
np.arange(0, 31, 5)
~~~

~~~
array([0, 1, 2, 3, 4])
array([ 0,  5, 10, 15, 20, 25, 30])
~~~
:::

### Indexes and values in other arrays

Create an array from nested arrays. Values in `array_2` are indexes in `array_1` and we create a new array take values in `array_1` which is corresponding to its indexes showed in `array_2`.

::: code-output-flex
~~~ python
array_1 = np.array([ [0,0,0], [1,1,1], [2,2,2] ])
array_2 = np.array([1,0,2,1,0,2,1]) # indexes in array_1
array_3 = array_1[array_2]

print(array_1)
print(array_2)
print(array_3)
~~~

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
:::

### Array of NaN values

::: code-output-flex
~~~ python
# single array
np.repeat(np.nan, 5)

# multi dimensional arrays
a = np.empty((2,3))
a[:] = np.nan
# other way
np.repeat([np.repeat(np.nan, 3)], 2, axis=0)
~~~

~~~
array([nan, nan, nan, nan, nan])

array([[nan, nan, nan],
       [nan, nan, nan]])
~~~
:::

### Repeated values

``` python
np.full((5,), 50) # 5x1 of 5
```

## Deleting

::: code-output-equal
~~~ python
# DELETE BY POSITIONS
arr = np.arange(6)
np.delete(arr, [3,4])
~~~

~~~
array([0, 1, 2, 3, 4, 5])
array([0, 1, 2, 5])
~~~
:::

::: code-output-equal
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

~~~
array([1, 2, 4, 5, 6])

array(['1', '2', '3'], dtype='<U21')
~~~
:::

::: code-output-equal
~~~ python
# Remove 'NaT' from an array
Y = np.array([600000, 300000, 'NaT'],
              dtype='timedelta64[ns]')
Y[~np.isnat(Y)]
~~~

~~~
array([600000, 300000],
       dtype='timedelta64[ns]')
~~~
:::


