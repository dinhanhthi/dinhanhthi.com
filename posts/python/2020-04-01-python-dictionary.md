---
layout: post
title: "Python Dictionary"
tags: [Python]
toc: true
icon: "/img/header/dict.svg"
notfull: 1
keywords: "dict dictionary access elements sorted by keys"
---

{% assign img-url = '/img/post/python' %}

## Checking

``` python
# check if empty
bool(my_dict) # False if empty
```

## Creating

<div class="col-2-equal">

~~~ python
# empty dict
my_dict = {}
~~~

~~~ python
# integer keys
my_dict = {1: "a", 2: 3}
~~~
</div>

~~~ python
# contains complicated types
my_dict = {1: ["1", "2"], "2": {1: 1, 2: 2}, 3: (1, 2)}
~~~

## Updating

``` python
d = {1: "one", 2: "three"}
d1 = {2: "two"}

# update value of key "2"
d.update(d1)

# add new key "3"
d2 = {3: "three"}
d.update(d2)
```

## Access elements

::: code-output-flex
~~~ python
my_dict = {1: "a", 2: "b"}
my_dict[1]
my_dict.keys()
my_dict.values()
my_dict.items()
~~~~

~~~
'a'
dict_keys([1, 2])
dict_values(['a', 'b'])
dict_items([(1, 'a'), (2, 'b')])
~~~
:::

::: code-output-flex
~~~ python
for key, val in my_dict.items():
  print(key, val)
~~~~

~~~
1 a
2 b
~~~
:::

If the key doesn't exist, use the default!

::: code-output-flex
~~~ python
dct = {1: 'a', 2: 'b'}
dct.get(1)
dct.get(3, 'c')
~~~~

~~~
'a'
'c'
~~~
:::

### Sorted keys

~~~ python
for key in sorted(my_dict.keys()):
  pass
~~~