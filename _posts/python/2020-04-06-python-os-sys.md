---
layout: post
title: "Python sys & os"
icon-photo: sys.svg
tags: ['101', python]
notfull: 1
categories: [python]
keywords: "list all files in a directory add path"
---

{% include toc.html %}

## Library

~~~ python
import os, sys
~~~

## Append path to the environnement

~~~ python
sys.path.append('../') # the path of current file's father
~~~

## Get files' info

<div class="flex-50" markdown="1">
~~~ python
# LIST OF ALL FILES
file_path = '.' # current dir
os.listdir(file_path)
~~~

~~~ python
# The last modification
os.path.getmtime(<full-path-to-file-name>)
~~~
</div>