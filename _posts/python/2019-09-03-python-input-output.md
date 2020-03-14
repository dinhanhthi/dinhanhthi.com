---
layout: post
title: "Input & Output"
categories: [python]
keywords: "print string display long strings long texts break the line word wrap multi lines multilines display decimal numbers display dataframes log logging warning info error alert"
---

{% assign img-url = '/img/post/python' %}

{% include toc.html %}

## Input

~~~ python
# Get input from user and display (input's type is `string`)
age = input("Your age? ") # python 3, raw_input for python 2
print("Your age:", age) # don't need space after "age"

# Get the input and store to numbers list
numbers = list(map(int, input().split()))

# Get multi inputs on 1 line
x, y, z, n = (int(input()) for _ in range(4))
~~~

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