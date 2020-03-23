---
layout: post
title: "Python Exception"
categories: [python]
keywords: "error except try"
---

# Try..Except

~~~ python
try: 
  # codes
except:
  # codes run if there is an exception
~~~

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

Other Errors, check [this list](https://docs.python.org/3/library/exceptions.html).