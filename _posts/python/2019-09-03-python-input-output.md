---
layout: post
title: "Input & Output"
categories: [python]
---

{% assign img-url = '/img/post/python' %}

{% include toc.html %}

## Input

Get input from user and display (input's type is `string`):

~~~ python
age = input("Your age? ") # python 3, raw_input for python 2
print("Your age:", age) # don't need space after "age"
~~~

Get the input and store to numbers list

~~~ python
numbers = list(map(int, input().split()))
~~~

Get multi inputs on 1 line:

~~~ python
x, y, z, n = (int(input()) for _ in range(4))
~~~


## Print strings

Print normally:

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
print("Hello!") # python 3
print "Hello!" # python 2
~~~

{:.output.flex-fill.d-flex}
~~~
Hello!
Hello!
~~~
</div>

Print with `format`:

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
print("Hello {} and {}.".format("A", "B"))
~~~

{:.output.flex-fill.d-flex}
~~~
Hello A and B.
~~~
</div>

Change the order:

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
print("Hello {2} and {1}.".format("A", "B"))
~~~

{:.output.flex-fill.d-flex}
~~~
Hello B and A.
~~~
</div>

Directly insert (python 3.6 or above):

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
b = "B"
print(f'Hello {"A"} and {b}.')
~~~

{:.output.flex-fill.d-flex}
~~~
Hello A and B.
~~~
</div>

## Print numbers

Print up to number of decimals:

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
number = 1
print("{:.6f}".format(number))
~~~

{:.output.flex-fill.d-flex}
~~~
1.000000
~~~
</div>

## Print multiple

They are separated by spaces.

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
print("1", 5, "thi")
~~~

{:.output.flex-fill.d-flex}
~~~
1 5 thi
~~~
</div>