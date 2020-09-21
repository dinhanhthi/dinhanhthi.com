---
layout: post
title: "Python Functions"
categories: [python]
tags: ['101', python]
keywords: "function def Unpacking a function Functions with stars kwargs args rargs lambda function check input verify raise error should we check the arguments type decorators @ notation at wrapper"
---

{% assign img-url = '/img/post/python' %}

{% include toc.html %}

## Facts

- In python, function is the **first-class object**. It's can be used as an argument.
- Function can be used as a return value.
  - `return func1`: reference to `func1`.
  - `return func1()`: results of evaluating `func()`.
- **Should we check the argument/input?**: **No!** The responsibility is on the caller! Your function should be well-documented, that's it!{% ref https://stackoverflow.com/questions/19684434/best-way-to-check-function-arguments-in-python %}

## Create a normal function

If a function doesn't return any value, it returns `None`.

<div class="flex-auto-equal-2" markdown="1">
~~~ python
# without arguments
def func_name():
  pass
~~~

~~~ python
# with arguments
def func_name(<args>):
  pass
~~~

~~~ python
# return
def func_name(<args>):
  return <some_thing>
~~~

~~~ python
# call a function
func_name(<args>)
~~~
</div>

## Unpacking a function

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
def sum_and_div(num1, num2):
  sum_nums = num1 + num2
  div_nums = num1 / num2
  return sum_nums, div_nums # multiple returns

sum, div = sum_and_div(18, 9)
print(sum, div)
~~~

{:.output.flex-fill.d-flex}
~~~
27 2.0
~~~
</div>

## Functions with stars (`*args` and `**kwargs`)

<sup>[[ref]](https://stackoverflow.com/questions/36901/what-does-double-star-asterisk-and-star-asterisk-do-for-parameters)</sup>The `*args` will give you all function parameters as **a tuple**:

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
def foo(*args):
  print(args)
  for a in args:
    print(a)

foo(1)
foo(2, 3, 4)
~~~

{:.output.flex-fill.d-flex}
~~~
(1,)
1
(2, 3, 4)
2
3
4
~~~
</div>

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
def foo(rarg1, rarg2):
  print(rarg1, rarg2)

lst = [1, 2]
foo(*lst)
tpl = (3, 4)
foo(*tpl)
~~~~

{:.output.flex-fill.d-flex}
~~~
1 2
3 4
~~~
</div>

If you wanna use "keywords arguments", use `**args`:

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
def kwfunc(**kwargs):
  print(type(kwargs))
  print(kwargs)

kwfunc()
kwfunc(kw1="thi", kw2="dinh")
~~~~

{:.output.flex-fill.d-flex}
~~~
<class 'dict'>
{}
<class 'dict'>
{'kw1': 'thi', 'kw2': 'dinh'}
~~~
</div>

Use a dictionary as an input,

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
def kwfunc(**kwargs): # must have **
  print(kwargs)

kwargs = {'kw1': "thi", 'kw2': "dinh"}
kwfunc(**kwargs) # must have **
~~~~

{:.output.flex-fill.d-flex}
~~~
{'kw1': 'thi', 'kw2': 'dinh'}
~~~
</div>

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
def kwfunc(kw1="john", kw2="doe"):
  print(kw1, kw2)

kwargs = {'kw1': "thi", 'kw2': "dinh"}

kwfunc()
kwfunc(kwargs) # goes to kw1
kwfunc(**kwargs) # goes to both kw1 & kw2
~~~~

{:.output.flex-fill.d-flex}
~~~
john doe
{'kw1': 'thi', 'kw2': 'dinh'} doe
thi dinh
~~~
</div>

Coupling `rargs`, `*args` and `**kwargs`:

- Required positional arguments: `rarg1`, `rarg2`, ...
- Optional positional arguments: `*args`.
- Optional key-values arguments: `**kwargs`.

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
def kwfunc(rarg1=0, rarg2=0, *args, **kwargs):
  print("required args: ", rarg1, rarg2)
  if args:
    print("*args: ", args)
  if kwargs:
    print("**kwargs: ", kwargs)
  print("\n")


kwfunc()
kwfunc(1, 2)
kwfunc(3, 4, 5, 6)
kwfunc(kw1="thi", kw2="dinh")
~~~~

{:.output.flex-fill.d-flex}
~~~
required args:  0 0

required args:  1 2

required args:  3 4
*args:  (5, 6)

required args:  0 0
**kwargs:  {'kw1': 'thi', 'kw2': 'dinh'}
~~~
</div>

All arguments after `*` must be key-value arguments,

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
def func(rarg1, rarg2, *, kwarg1, kwarg2):
  print("required args: ", rarg1, rarg2)
  print("kwarg*: ", kwarg1, kwarg2)

# func(1, 2, 3, 4) # error!
func(1, 2, kwarg1=3, kwarg2=4)
~~~~

{:.output.flex-fill.d-flex}
~~~
required args:  1 2
kwarg*:  3 4
~~~
</div>

## Lambda function

It's convenient but don't use it regularly, use `def` (in 1 line) instead.

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
x = lambda a : a + 10
print(x(5))

# you can use this
def x(a): return a + 10
~~~~

{:.output.flex-fill.d-flex}
~~~
15
~~~
</div>

``` python
# if else with lambda function
lambda row: 'good' if (row>=80) else ('bad' if row<80 else '')
```

## Check input & raise error

Something like that,

~~~ python
if par1 is None:
  msg = "par1 must be in type `int`"
  raise TypeError(msg)
~~~

You can check other exceptions [here](https://docs.python.org/3/library/exceptions.html).

## Decorators

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
def my_decorator(func):
    def wrapper():
        print("Before func called.")
        func()
        print("After func called.")
    return wrapper

def say_whee():
    print("Whee!")

say_whee = my_decorator(say_whee)
say_whee()
~~~~

{:.output.flex-fill.d-flex}
~~~
Something is happening before the function is called.
Whee!
Something is happening after the function is called.
~~~
</div>

In a class (note that, there is no `self` parameter in `_deco`),

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
class test_class():

    def _deco(func):
        def wrapper(self, name):
            print('before func called')
            func(self, name)
            print('after func called')
        return wrapper

    @_deco
    def fit(self, name):
        print('Hello, ', name)

a = test_class()
a.fit('thi')
~~~

{:.output.flex-fill.d-flex}
~~~
before func called
Hello,  thi
after func called
~~~
</div>