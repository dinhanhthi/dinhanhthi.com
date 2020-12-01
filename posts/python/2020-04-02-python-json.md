---
layout: post
title: "Python JSON"
tags: [Python]
toc: false
notfull: 1
icon: json.svg
keywords: "json JavaScript Object Notation Serialization Deserialization"
---

{% assign img-url = '/img/post/python' %}

JSON (JavaScript Object Notation) is a format that encodes objects in a string.

## Terms

- **Serialization** : convert an object → string.
- **Deserialization** : convert string → object.

<div class="col-2-equal">

~~~ python
# object
{foo: [1, 4, 7, 10], bar: "baz"}
~~~

~~~ python
# string
'{"foo":[1,4,7,10],"bar":"baz"}'
~~~
</div>

## JSON with python{% ref "https://docs.python.org/3/library/json.html" %}

### Basics

~~~ python
import json
~~~

<div class="col-2-equal">

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

        elif isinstance(dictionary[key], (np.integer, int, np.int64)):
            dict_json[key] = int(dictionary[key])

        elif isinstance(dictionary[key], (np.floating, float)):
            dict_json[key] = float(dictionary[key])

        elif isinstance(dictionary[key], (pd.Timedelta, pd.Timestamp,
            dt.timedelta, dt.datetime, dt.date, dt.time)):
            dict_json[key] = str(dictionary[key])

        elif isinstance(dictionary[key], np.bool_): # numpy boolean
            dict_json[key] = bool(dictionary[key])

        elif dictionary[key] is None:
            dict_json[key] = None

        elif dictionary[key] == True:
            dict_json[key] = bool(True)

        elif dictionary[key] == False:
            dict_json[key] = bool(False)

        else:
            log.debug('type pb: %s', type(dictionary[key]))
            dict_json[key] = 'not JSON serializable'

    return dict_json
~~~

