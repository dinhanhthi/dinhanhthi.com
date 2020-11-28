---
layout: post
title: "Regular Expression in Python"
tags: [Python]
toc: true
icon: "/img/about/python.svg"
notfull: 1
keywords: special characters
---

{% assign img-url = '/img/post/python' %}

We can select string with some patterns.

## Import library

~~~ python
import re
~~~

## Special characters

- `.` matches any character except a newline
- `^a` all strings starting with `'a'`
- `a$` all strings ending with `'a'`
- `ab+` matches `'ab'`, `'abb'` but not `'a'`, `'ac'`.
- `[bcr]at` any characters within `[]` can be filled the space
- Using `\` to escape special characters
  - `\s` : whitespace characters. `\S`: any except whitespace.
  - `\b` : empty strings (only at the beginning or end of a word). `\B`:
- `cat|dog` would match `'catfish'` and `'hotdog'` for **begin** and **end** characters
- `[amk]` will match `'a'`, `'m'`, or `'k``
- `[0-9]` will match any character that falls between `0` and `9`
- `[a-z]` : lowercase
- `[0-9]{4}`: **repeat** the pattern `[0-9]` four times by writing
- `a{m,n}` matches from `m` to `n` repetitions of `'a'`.
  - `a{m,}` matches from `m` to infinity repetitions of `'a'`.

## References

- **Python docs** -- [Regular Expression](https://docs.python.org/3/library/re.html).