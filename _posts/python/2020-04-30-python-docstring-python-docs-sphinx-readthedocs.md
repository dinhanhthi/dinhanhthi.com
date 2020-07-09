---
layout: post
title: "Python Docs: Sphinx"
categories: [python]
tags: ['101', python]
keywords: "documentation sphinx napoleon google style numpy style ReadTheDocs rst reStructuredText"
---

{% assign img-url = '/img/post/python/input-output' %}

{% include toc.html %}

## Install

``` bash
# install python first
pip install sphinx
pip install sphinx-autobuild
pip install sphinx_rtd_theme
pip install sphinxcontrib-napoleon # theme
```

## Folder structure

``` bash
|-- package # python package
|-- root
    |-- build
        |-- html # rendered html
    |-- source
        |-- conf.py
```

``` python
# conf.py
import os
import sys
import sphinx_rtd_theme
import sphinxcontrib

project = 'My notes'
copyright = '2020, Math2IT'
author = 'Anh-Thi DINH'
release = '0.2'

extensions = [
    'sphinxcontrib.napoleon',
    'sphinx_rtd_theme',
    'sphinx.ext.mathjax'
]

napoleon_include_init_with_doc = True
napoleon_google_docstring = True
napoleon_use_param = True
napoleon_use_ivar = True

html_theme = 'sphinx_rtd_theme'

html_theme_options = {
    'display_version': True,
    'prev_next_buttons_location': 'both',
    'style_external_links': True,
    'style_nav_header_background': '#F5A603',
    'sticky_navigation': True,
    'navigation_depth': 4,
}
```

## Build

<div class="flex-50" markdown="1">
``` bash
# build
sphinx-build source build
```

``` bash
# auto build + watch the change
sphinx-autobuild source build
# http://127.0.0.1:8000/
```
</div>

## Format

### Link

Cross url (in the same document){% ref https://sublime-and-sphinx-guide.readthedocs.io/en/latest/references.html#links-to-sections-in-the-same-document %}

<div class="flex-50" markdown="1">
``` bash
# place to ref
:ref:`custum text<CSVLoader>`.
```

``` bash
# somewhere
.. _CSVLoader:

CSV
~~~
```
</div>

## References

