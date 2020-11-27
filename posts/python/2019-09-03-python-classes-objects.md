---
layout: post
title: "Python Classes & Objects"
tags: [Python]
icon: "/img/about/python.svg"
toc: true
keywords: "classes vs objects methods instances blueprint attributes import local class empty file __init__.py ValueError: attempted relative import beyond top-level package same folder subfolder another folder from incldue get and access attributes of a class abstract class method super father child son Syntactic sugar easier to read why self Syntactic sugar"
---

## Classes vs Objects vs Instances vs Methods

- **Class** is a blueprint/template of an object.
  - Each class has its own **attributes** (its states) and **methods** (its behaviors).
- **Object** is a bundle of related attributes and methods.
- **Instance** is a single and unique unit of a class.
  - Many instances may have the same class. They have attributes and methods defined in the class.

::: hsbox An example
A **class** `student` represents (a template of) an **object** student with:

- Attributes: `name`, `marks` and
- Methods: `take_exams()`, `graduate()`.

**Instances** `john_doe` and `jane_doe` defined from class `student` will have:

- Their names: `john_doe.name` and `jane_doe.name`.
- Their marks: `john_doe.marks` and `jane_doe.marks`.
- Their behaviors: `john_doe.take_exams()` and `jane_doe.graduate()`, ...
:::

## Syntactic sugar & `self`

Syntactic sugar is syntax within a programming language that is designed to make things easier to read or to express. For example, we use `arr[i,j]` but behind the scene, it's `get_element(arr, vector(i,j))`.

~~~ python
class MyClass()
    def method(arg):
        print(arg)

my_object = MyClass()
my_object.method('foo')
# TypeError: method() takes exactly 1 positional argument (2 given)
~~~

`my_object.method('foo')` means `MyClass.method(my_object, 'foo')`. That's why we need `self` or a [decorator](https://docs.python.org/3/glossary.html#term-decorator),

::: code-2cols
~~~ python
class MyClass():
    def method(self, arg):
        print(arg)
~~~

~~~ python
# DON'T NEED `self`
class MyClass():
    @staticmethod
    def method(self, arg):
        print(arg)
~~~
:::

## Get all attributes of a class

~~~ python
# CHECK THERE IS AN ATTRIBUTE
getattr(MyClass, 'report', None)
# if there is a class, it return this class' detail
# if not, return None
~~~

~~~ python
def props(cls):
    return [i for i in cls.__dict__.keys() if i[:1] != '_']

# access these attributes
properties = props(MyClass)
for att in properties:
    print(getattr(MyClass, att))
~~~

~~~ python
# Get dictionaries of all attributes & their values
MyClass.__dict__
~~~

## Import local class

Suppose that we have a folders/files structure like below,

::: code-2cols
~~~ bash
# ORIGINAL STRUCTURE
popai/
  processings/
    a.py # contains class ABC
    test/
      b.py
  lib/
    c.py # contains class XYZ
~~~

~~~ bash
# UPDATED STRUCTURE
popai/
  __init__.py
  processings/
    __init__.py
    a.py # contains class ABC
    test/
      __init__.py
      b.py
  lib/
    c.py # contains class XYZ
~~~
:::

We want import both classes `ABC` and `XYZ`,

::: code-2cols
~~~ python
# b.py
from popai.processings.a import ABC
~~~

~~~ python
# a.py
from popai.lib.c import XYZ
~~~
:::

Just add `__init__.py` like in the right box above.

Some errors may occur,

~~~ python
ValueError: attempted relative import beyond top-level package
~~~

## Father and Son

::: code-2cols
~~~ python
# FATHER
class father_class():
  def __init__(self):
    self.abc = 1
~~~

~~~ python
# SON
class son_class(father_class):
  def __init__(self):
    # son_class has attribute `abc`
    super().__init__()
    self.xyz = 2
~~~
:::

If you want son takes all parameters of father and use additional parameters,

``` python
class Shape:
    def __init__(self, shapename):
        self.shapename = shapename

class ColoredShape(Shape):
    def __init__(self, color, **kwargs):
        super().__init__(**kwargs)
        self.color = color

cs = ColoredShape(color='red', shapename='circle')
```

## Abstract Base Classes (ABC)

~~~ python
from abc import ABC, abstractmethod
~~~

::: code-2cols
~~~ python
# FATHER CLASS
class BaseModel(ABC):
  def __init__(self):
    pass

  # child class must have
  @abstractmethod
  def fit(self, X):
    pass

  # child class must have
  @abstractmethod
  def predit(self, X):
    pass

  # children class don't need to have
  #   but they can call
  def fit_predict(self, X):
    pass
~~~

~~~ python
# CHILD CLASS
class LinearModel(BaseModel)
  def __init__(self):
    pass

  # must-have
  def fit(self, X):
    pass

  # must-have
  def predict(self, X):
    pass

  # this call can use .fix_predict()
  #   from its father!
~~~
:::



