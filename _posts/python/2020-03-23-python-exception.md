---
layout: post
title: "Python Exception"
categories: [python]
tags: ['101', error, python]
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