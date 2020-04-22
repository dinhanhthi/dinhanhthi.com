---
layout: post
title: "Python Exception"
categories: [python]
tags: ['101', error, python]
notfull: 1
keywords: "error except try"
---

{% include toc.html %}

## Try..Except

~~~ python
try: 
  # codes
except:
  # codes run if there is an exception
~~~

<div class="flex-auto-equal-2" markdown="1">
~~~ python
try: 
  # codes
except:
  # codes run if there is an exception
else:
  # no exception?
~~~

~~~ python
try:
  # try codes
except FileNotFoundError as fnf_error:
    print(fnf_error)
except AssertionError as error:
    print(error)
~~~
</div>

Other Errors, check [this list](https://docs.python.org/3/library/exceptions.html).

## Apply

### Check `str` of float

~~~ python
element = 'mean'
try:
    print(float(element))
except ValueError:
    if element == 'mean':
        print('hello mean')
~~~