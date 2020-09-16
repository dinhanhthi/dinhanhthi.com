---
layout: post
title: "Python: Input & Output"
categories: [python]
tags: ['101', python-data, python]
keywords: "print string display long strings long texts break the line word wrap multi lines multilines display decimal numbers display dataframes log logging warning info error alert docstring comment multiline comments documentation class definition sample structure example"
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

``` python
# first 20 characters, second 10 characters
print( '{:<20s} {:<10s}'.format(string_one, string_two) )
```

Display separated results (like in executing multiple code cells),

~~~ python
display(df_1)
display(df_2)
~~~

## Logging

Check more [here](https://docs.python.org/3/howto/logging-cookbook.html).

~~~ python
import logging
log = logging.getLogger(__name__)

# order of increasing severity
log.debug('something')
log.info('something')
log.warning('something')
log.error('something')
logger.critical('something')

# by default, the logging module logs the messages with a severity level of WARNING or above
# thus: debug and info aren't show by default
~~~

If the `log.info()` doesn't work, set below{% ref https://stackoverflow.com/questions/11548674/logging-info-doesnt-show-up-on-console-but-warn-and-error-do/11548754 %},

~~~ python
logging.getLogger().setLevel(logging.INFO) # show all except "debug"
# or
logging.basicConfig(level=logging.DEBUG) # show all
~~~

<div class="flex-50" markdown="1">
``` python
# in the class
import logging
log = logging.getLogger(__name__)

log.info("abc")
log.debug("xyz")

log.info("abc: %s", abc)
log.debug("xyz: {}".format(xyz))
```

``` python
# in the jupyter notebook
import logging
log = logging.getLogger(__name__)
logging.basicConfig(level=os.environ.get("LOGLEVEL", "DEBUG"))
```
</div>