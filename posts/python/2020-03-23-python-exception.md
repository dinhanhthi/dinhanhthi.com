---
layout: post
title: "Python Exception"
tags: [Python]
toc: true
icon: "/img/about/python.svg"
notfull: 1
keywords: "error except try"
---

## Try..Except

~~~ python
try:
  # codes
except:
  # codes run if there is an exception
~~~

<div class="col-2-equal">

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