---
layout: post
title: "Python: Input & Output"
categories: [python]
tags: ['101', python-data]
keywords: "print string display long strings long texts break the line word wrap multi lines multilines display decimal numbers display dataframes log logging warning info error alert docstring comment multiline comments documentation class definition sample structure example docstring __doc__ help sphinx numpydoc formats HDF Hierarchical Data Format hdf5"
---

{% assign img-url = '/img/post/python/input-output' %}

{% include toc.html %}

## Input

~~~ python
# Get input from user and display (input's type is `string`)
age = input("Your age? ") # python 3, raw_input for python 2
print("Your age:", age) # don't need space after "age"
~~~

~~~ python
# Get the input and store to numbers list
numbers = list(map(int, input().split()))
~~~

~~~ python
# Get multi inputs on 1 line
x, y, z, n = (int(input()) for _ in range(4))
~~~

### Comment

Using `#` on each line.

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
# print("This is not showed.")
print("This is showed.)
~~~

{:.output.flex-fill.d-flex}
~~~
This is showed.
~~~
</div>

## Print / Display

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
# Print normally
print("Hello!") # python 3
print "Hello!" # python 2

# print with `format`
print("Hello {} and {}.".format("A", "B"))

# change order
print("Hello {2} and {1}.".format("A", "B"))

# Directly insert (python 3.6 or above)
b = "B"
print(f'Hello {"A"} and {b}.')

# long strings
print('This is a part of sentence.'
      'This is other part.')
~~~

{:.output.flex-fill.d-flex}
~~~
# Print normally
Hello!
Hello!

# print with `format`
Hello A and B.

# change order
Hello B and A.

# Directly insert
Hello A and B.


# long strings
This is a part of sentence. This is other part.
~~~
</div>

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
# print decimals
print("{:.6f}".format(number))
~~~

{:.output.flex-fill.d-flex}
~~~
# print decimals
1.000000
~~~
</div>

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
# print multiples
print("1", 5, "thi") # there are spaces
~~~

{:.output.flex-fill.d-flex}
~~~
# print multiples
1 5 thi
~~~
</div>

Display separated results (like in executing multiple code cells),

~~~ python
display(df_1)
display(df_2)
~~~

## Logging{% ref https://docs.python.org/3/howto/logging-cookbook.html %}

~~~ python
import logging
log = logging.getLogger(__name__)

log.warning('something')
log.info('something')
log.debug('something')
log.error('something')
logger.critical('something')
~~~

If the `log.info()` doesn't work, set below{% ref https://stackoverflow.com/questions/11548674/logging-info-doesnt-show-up-on-console-but-warn-and-error-do/11548754 %},

~~~ python
logging.getLogger().setLevel(logging.INFO)
# or
logging.basicConfig(level=logging.DEBUG)
~~~

## Docstring

### What?

If you wanna make a [docstring](https://en.wikipedia.org/wiki/Docstring) (showing the information of a function when using `help(<func>)` or `func.__doc__`).

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
def reverse(text):
    """Reverse a text.
    Input the text.
    Return text reversed.
    """
    return text[::-1]

help(reverse)
~~~

{:.output.flex-fill.d-flex}
~~~
Help on function reverse in module __main__:

reverse(text)
    Reverse a text.
    Input the text.
    Return text reversed.
~~~
</div>

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
reverse.__doc__

print(reverse.__doc__)
~~~

{:.output.flex-fill.d-flex}
~~~
'Reverse a text.\n    Input the text.\n    Return text reversed.\n    '

Reverse a text.
    Input the text.
    Return text reversed.
~~~
</div>

### Sample structure

Using [nympydoc](https://numpydoc.readthedocs.io/en/latest/) format (there are [others](https://stackoverflow.com/questions/3898572/what-is-the-standard-python-docstring-format)). It's recommended to be used later in [Sphinx](http://sphinx.pocoo.org/). See more [here](https://numpydoc.readthedocs.io/en/latest/example.html) and [Example NumPy Style Python Docstrings](https://sphinxcontrib-napoleon.readthedocs.io/en/latest/example_numpy.html).

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
def ex_class(var1, var2):
    """
    Quick description.
    Longer description with `keywords`.
    
    Parameters
    ----------
    var1 : int
        Desc for var1.
    var2 : {0 or 'index', 1 or 'columns'}, default 0
        Long desc for var2. It may take a long line and we can break
        this like that.
        
    Returns
    -------
    Resampler object
    
    See Also
    --------
    groupby : Group by mapping, function, label, or list of labels.
    Series.resample : Resample a Series.

    Notes
    -----
    See the `user guide
    <https://pandas.pydata.org/pandas-docs/stable/user_guide/timeseries.html#resampling>`_
    for more.
    
    Examples
    --------
    Start by creating a series with 9 one minute timestamps.
    >>> index = 1 +1
    2
    Description for this example.
    """
    # some commands
    return return_values
~~~

{:.output.flex-fill.d-flex}
~~~
    Quick description.
    Longer description with `keywords`.
    
    Parameters
    ----------
    var1 : int
        Desc for var1.
    var2 : {0 or 'index', 1 or 'columns'}, default 0
        Long desc for var2. It may take a long line and we can break
        this like that.
        
    Returns
    -------
    Resampler object
    
    See Also
    --------
    groupby : Group by mapping, function, label, or list of labels.
    Series.resample : Resample a Series.

    Notes
    -----
    See the `user guide
    <https://pandas.pydata.org/pandas-docs/stable/user_guide/timeseries.html#resampling>`_
    for more.
    
    Examples
    --------
    Start by creating a series with 9 one minute timestamps.
    >>> index = 1 +1
    2
    Description for this example.
~~~
</div>

## Hierarchical Data Format (HDF)

- Designed to store and organize large amounts of data.
- Store multiple data files in **a single data file**!
  - Different types of information.
  - Self describing (metadata included in the file)
- **Properties**{% ref https://www.youtube.com/watch?v=nddj5OA8LJo %}:
  - **Datasets** (numpy arrays): fast slicing, compression.
  - **Group** (dictionaries): nesting, POSIX path syntax.
  - **Attributrs** (metadata): datasets/group, key-value.
- HDF5 is row based and really effient than csv for very large file size{% ref https://stackoverflow.com/questions/16639877/hdf5-taking-more-space-than-csv %}.
- Extensions: `.h5`, `.hdf`, `.hdf4`, ...
- Tool: [HDFView](https://www.hdfgroup.org/downloads/hdfview/)
- Example{% ref https://www.neonscience.org/about-hdf5 %}:

{:.img-full-70}
![An example of HDF5 structure]({{img-url}}/hdf5_structure4.jpg)
_An example HDF5 file structure which contains groups, datasets and associated metadata._

~~~ python
import h5py

f = h5py.File('mytestfile.hdf5', 'r') # read a file
# h5py.File acts like Python dict
dset = f['mydataset']
dset.attrs # attribute
~~~


