---
layout: post
title: "Sphinx & reStructuredText"
categories: [python]
tags: ['101', python]
notfull: 1
keywords: "documentation sphinx napoleon google style numpy style ReadTheDocs rst reStructuredText autodoc class theme docstrings"
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
|-- project
    |-- custom_lib # python package
    |-- custom_lib-doc
        |-- source
            |-- conf.py
```

``` python
# conf.py
import os, sys
import sphinx_rtd_theme
import sphinxcontrib

path_custom_lib = os.path.abspath('../../')
sys.path.append(path_custom_lib)

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

``` bash
# folder structure
|-- project
    |-- custom_lib
    |-- custom_lib-doc
        |-- source
            |-- conf.py
```

<div class="flex-50" markdown="1">
``` bash
# build
sphinx-build source build
```

``` bash
# auto build + watch the change
sphinx-autobuild source _local -p 8555
# http://127.0.0.1:8555/
```
</div>

## Format

### Link

Cross url (in the same document){% ref https://sublime-and-sphinx-guide.readthedocs.io/en/latest/references.html#links-to-sections-in-the-same-document %}

<div class="flex-50" markdown="1">
``` bash
# place to ref
:ref:`custum text<CSVLoader>`.

# Display "CSV"
:ref:`CSVLoader`
```

``` bash
# somewhere
.. _CSVLoader:

CSV
===
```
</div>

``` bash
# if heading inside the same file as the caller
Call to `Name of heading`_

Name of heading
===============
```

External urls:

<div class="flex-50" markdown="1">
``` bash
External hyperlinks, like Python_.

.. _Python: http://www.python.org/
```

``` bash
External hyperlinks, like `About Python`_.

.. _About Python: http://www.python.org/
```
</div>


### Alert boxes

<div class="flex-50" markdown="1">
``` bash
# note
.. note:: First paragraph.

    Second paragraph.
```

``` bash
# warning
.. warning:: Content of the warning.
```
</div>

### Insert images

<div class="flex-50" markdown="1">
``` bash
# block
.. image:: images/ball1.gif
```

``` bash
# inline
The |biohazard| symbol.

.. |biohazard| image:: biohazard.png
```
</div>

## Autodoc from python library

<div class="flex-50" markdown="1">
``` bash
# folder structure
|-- project
    |-- custom_lib
    |-- custom_lib-doc
        |-- source
            |-- conf.py
```

``` python
# conf.py
import os
import sys

path_custom_lib = os.path.abspath('../../')
sys.path.append(path_custom_lib)
```
</div>

<div class="flex-50" markdown="1">
``` bash
# all classes in classes.py
.. automodule:: custom_lib.folder.classes
   :members:
```

``` bash
# a specific class in classes.py
.. autoclass:: custom_lib.folder.classes.ClassA
   :members:
```
</div>

## References

- [Rest and Sphinx Memo](https://rest-sphinx-memo.readthedocs.io/en/latest/intro.html).
- **docutils** -- [Quick ref to rst format](https://docutils.sourceforge.io/docs/user/rst/quickref.html).
- **Thomas Cokelaer** -- [Sphinx and RST syntax guide](https://thomas-cokelaer.info/tutorials/sphinx/rest_syntax.html)
- **Sam Nicholls** -- [An idiot’s guide to Python documentation with Sphinx and ReadTheDocs](https://samnicholls.net/2016/06/15/how-to-sphinx-readthedocs/)
- **sphinx-doc** -- [Include documentation from docstrings](https://www.sphinx-doc.org/en/master/usage/extensions/autodoc.html)