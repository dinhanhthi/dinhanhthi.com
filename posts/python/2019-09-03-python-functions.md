---
layout: post
title: "Python Functions"
tags: [Python]
toc: true
icon: "/img/about/python.svg"
keywords: "function def Unpacking a function Functions with stars kwargs args rargs lambda function check input verify raise error should we check the arguments type decorators @ notation at wrapper"
---

## Facts

- In python, function is the **first-class object**. It's can be used as an argument.
- Function can be used as a return value.
  - `return func1`: reference to `func1`.
  - `return func1()`: results of evaluating `func()`.
- **Should we check the argument/input?**: **No!** The responsibility is on the caller! Your function should be well-documented, that's it!{% ref "https://stackoverflow.com/questions/19684434/best-way-to-check-function-arguments-in-python" %}

## Create a normal function

If a function doesn't return any value, it returns `None`.

::: code-2cols
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
:::

## Unpacking a function

::: code-output-flex
~~~ python
def sum_and_div(num1, num2):
  sum_nums = num1 + num2
  div_nums = num1 / num2
  return sum_nums, div_nums # multiple returns

sum, div = sum_and_div(18, 9)
print(sum, div)
~~~

~~~
27 2.0
~~~
:::

## Functions with stars (`*args` and `**kwargs`)

The `*args` will give you all function parameters as **a tuple**:{% ref "https://stackoverflow.com/questions/36901/what-does-double-star-asterisk-and-star-asterisk-do-for-parameters" %}

::: code-output-equal
~~~ python
def foo(*args):
  print(args)
  for a in args:
    print(a)

foo(1)
foo(2, 3, 4)
~~~

~~~
(1,)
1
(2, 3, 4)
2
3
4
~~~
:::

::: code-output-equal
~~~ python
def foo(rarg1, rarg2):
  print(rarg1, rarg2)

lst = [1, 2]
foo(*lst)
tpl = (3, 4)
foo(*tpl)
~~~~

~~~
1 2
3 4
~~~
:::

If you wanna use "keywords arguments", use `**args`:

::: code-output-equal
~~~ python
def kwfunc(**kwargs):
  print(type(kwargs))
  print(kwargs)

kwfunc()
kwfunc(kw1="thi", kw2="dinh")
~~~~

~~~
<class 'dict'>
{}
<class 'dict'>
{'kw1': 'thi', 'kw2': 'dinh'}
~~~
:::

Use a dictionary as an input,

::: code-output-equal
~~~ python
def kwfunc(**kwargs): # must have **
  print(kwargs)

kwargs = {'kw1': "thi", 'kw2': "dinh"}
kwfunc(**kwargs) # must have **
~~~~

~~~
{'kw1': 'thi', 'kw2': 'dinh'}
~~~
:::

::: code-output-equal
~~~ python
def kwfunc(kw1="john", kw2="doe"):
  print(kw1, kw2)

kwargs = {'kw1': "thi", 'kw2': "dinh"}

kwfunc()
kwfunc(kwargs) # goes to kw1
kwfunc(**kwargs) # goes to both kw1 & kw2
~~~~

~~~
john doe
{'kw1': 'thi', 'kw2': 'dinh'} doe
thi dinh
~~~
:::

Coupling `rargs`, `*args` and `**kwargs`:

- Required positional arguments: `rarg1`, `rarg2`, ...
- Optional positional arguments: `*args`.
- Optional key-values arguments: `**kwargs`.

::: code-output-flex
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
~~~

~~~
required args:  0 0

required args:  1 2

required args:  3 4
*args:  (5, 6)

required args:  0 0
**kwargs:  {'kw1': 'thi', 'kw2': 'dinh'}
~~~
:::

All arguments after `*` must be key-value arguments,

::: code-output-flex
~~~ python
def func(rarg1, rarg2, *, kwarg1, kwarg2):
  print("required args: ", rarg1, rarg2)
  print("kwarg*: ", kwarg1, kwarg2)

# func(1, 2, 3, 4) # error!
func(1, 2, kwarg1=3, kwarg2=4)
~~~~

~~~
required args:  1 2
kwarg*:  3 4
~~~
:::

## Lambda function

It's convenient but don't use it regularly, use `def` (in 1 line) instead.

::: code-output-equal
~~~ python
x = lambda a : a + 10
print(x(5))

# you can use this
def x(a): return a + 10
~~~~

~~~
15
~~~
:::

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

::: code-output-equal
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

~~~
Before func called.
Whee!
After func called.
~~~
:::

In a class (note that, there is no `self` parameter in `_deco`),

::: code-output-equal
~~~ python
class test_class():

    def _deco(func):
        def wrapper(self, name):
            print('Before func called')
            func(self, name)
            print('After func called.')
        return wrapper

    @_deco
    def fit(self, name):
        print('Hello, ', name)

a = test_class()
a.fit('thi')
~~~

~~~
Before func called
Hello,  thi
After func called
~~~
:::