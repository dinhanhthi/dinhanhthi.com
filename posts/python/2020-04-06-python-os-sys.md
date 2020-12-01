---
layout: post
title: "Python sys & os"
tags: [Python]
toc: false
icon: "/img/header/sys.svg"
notfull: 1
keywords: "list all files in a directory add path"
---

## Library

~~~ python
import os, sys
~~~

## Append path to the environnement

~~~ python
sys.path.append('../') # the path of current file's father
~~~

## Get files' info

<div class="col-2-equal">

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