---
layout: post
title: "Python JSON"
categories: [python]
tags: ['101', python]
icon-photo: json.svg
keywords: "json JavaScript Object Notation Serialization Deserialization"
---

{% assign img-url = '/img/post/python' %}
{% include toc.html %}

JSON (JavaScript Object Notation) is a format that encodes objects in a string.

## Terms

- **Serialization** : convert an object → string.
- **Deserialization** : convert string → object.

<div class="flex-50" markdown="1">
~~~ python
# object
{foo: [1, 4, 7, 10], bar: "baz"}
~~~

~~~ python
# string
'{"foo":[1,4,7,10],"bar":"baz"}'
~~~
</div>

## JSON with python{% ref https://docs.python.org/3/library/json.html %}

### Basics

~~~ python
import json
~~~

<div class="flex-50" markdown="1">
~~~ python
# DECODING
json.load()
~~~

~~~ python
# ENCODING
json.dumps()
json.dump()
~~~
</div>

### Dict to JSON

~~~ python
def dict_to_json(dictionary):
    """ Transform dictionary that contain numpy instances into a
        JSON serializable dictionary.

    Parameters
    ----------
    dictionary: dict
        The dictionary to tranform.

    Returns
    -------
    dict
        The JSON serializable dictionary.
    """
    dict_json = {}
    for key in dictionary:
        if isinstance(dictionary[key], dict):
            dict_json[key] = dict_to_json(dictionary[key])
        elif isinstance(dictionary[key], str):
            dict_json[key] = dictionary[key]
        elif hasattr(dictionary[key], "__len__"):
            dict_json[key] = [to_json(v) for v in dictionary[key]]
        elif isinstance(dictionary[key], np.integer):
            dict_json[key] = int(dictionary[key])
        elif isinstance(dictionary[key], np.floating):
            dict_json[key] = float(dictionary[key])
        else:
            dict_json[key] = dictionary[key]
    return dict_json
~~~

