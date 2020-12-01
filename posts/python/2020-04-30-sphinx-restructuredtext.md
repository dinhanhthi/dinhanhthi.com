---
layout: post
title: "Sphinx & reStructuredText & docstring"
tags: [Python]
toc: true
icon: "/img/about/sphinx.svg"
notfull: 1
keywords: "documentation sphinx napoleon google style numpy style ReadTheDocs rst reStructuredText autodoc class theme docstrings docstring __doc__ help sphinx numpydoc formats"
---

{% assign img-url = '/img/post/python/input-output' %}

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

<div class="col-2-equal">

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

### Headings

``` bash
H1 heading
==========

H2 heading
----------

H3 heading
..........

H4 heading
~~~~~~~~~~
```

### Link

Cross url (in the same document){% ref "https://sublime-and-sphinx-guide.readthedocs.io/en/latest/references.html#links-to-sections-in-the-same-document" %}

<div class="col-2-equal">

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

<div class="col-2-equal">

``` bash
External hyperlinks, like Python_.

.. _Python: http://www.python.org/

# or inline
`Python <http://www.python.org/>`_.
```

``` bash
External hyperlinks, like `About Python`_.

.. _About Python: http://www.python.org/
```
</div>

To a class, method,... in the python library ([this question](https://stackoverflow.com/questions/22700606/how-would-i-cross-reference-a-function-generated-by-autodoc-in-sphinx/22714510) -> [ref](https://www.sphinx-doc.org/en/master/usage/restructuredtext/domains.html#cross-referencing-python-objects)),

``` bash
:py:meth:`mymodule.MyClass.mymethod`

# or even shorter (if python is default)
:meth:`mymodule.MyClass.mymethod`

# custom text
:py:meth:`custom text<mymodule.MyClass.mymethod>`
```

- `:class:`: for classes.


### Alert boxes

<div class="col-2-equal">

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

<div class="col-2-equal">

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

### Insrt code

<div class="col-2-equal">

``` bash
# without syntax highlight
::

    def abc():
        pass
```

``` bash
# with syntax highlight
.. code-block:: python

    def abc():
        pass
```
</div>

## Autodoc from python library

👉 [Main ref](https://www.sphinx-doc.org/en/master/usage/extensions/autodoc.html).

<div class="col-2-equal">

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

``` bash
# all classes in classes.py
.. automodule:: custom_lib.folder.classes
   :members:

# in case `fit`, `predict` didn't show
.. automodule:: custom_lib.folder.classes
   :members:
   :undoc-members:
```

``` bash
# a specific class in classes.py
.. autoclass:: custom_lib.folder.classes.ClassA
   :members:
```
</div>

### Problem of "Attributes"

- When we use `"Attributes"` in docstring, the sphinx ([sphinx_rtd_theme](https://github.com/readthedocs/sphinx_rtd_theme) template) will render it as `"Variables"` if we indicate `napoleon_use_ivar = True` in the config. (check [this issue](https://github.com/sphinx-doc/sphinx/issues/2115#issuecomment-314703605))
- List of [supported section headers](https://www.sphinx-doc.org/en/master/usage/extensions/napoleon.html) in docstring.
- Read [this blog](https://michaelgoerz.net/notes/extending-sphinx-napoleon-docstring-sections.html) as an option. <mark>It works for Google Docstring, not numpy docstring yet!</mark>

### Problem with decorator

Sphinx doesn't render docstring for classes coming with decorator, i.e. `@something` (before `def`). We can't use only `:members:`.

<div class="col-2-equal">

``` python
from functools import wraps
def my_decorator(f):
    @wraps(f)
    def wrapper(*args, **kwds):
        """Doc from wrapper"""
        print('Calling decorated function')
        return f(*args, **kwds)
    return wrapper
```

``` python
@my_decorator
def example():
    """Docstring"""
    print('Called example function')
```
</div>

::: code-output-equal
``` python
example.__doc__ # with @wraps(f)

example.__doc__ # without @wraps(f)
```

``` bash
'Docstring'

'Doc from wrapper'
```
:::

## Docstring

### What?

If you wanna make a [docstring](https://en.wikipedia.org/wiki/Docstring) (showing the information of a function when using `help(<func>)` or `func.__doc__`).

::: code-output-equal
~~~ python
def reverse(text):
    """Reverse a text.
    Input the text.
    Return text reversed.
    """
    return text[::-1]

help(reverse)
~~~

~~~
Help on function reverse in module __main__:

reverse(text)
    Reverse a text.
    Input the text.
    Return text reversed.
~~~
:::

::: code-output-equal
~~~ python
reverse.__doc__

print(reverse.__doc__)
~~~

~~~
'Reverse a text.\n    Input the text.\n    Return text reversed.\n    '

Reverse a text.
    Input the text.
    Return text reversed.
~~~
:::

### Numpy Style

👉 [Official docs](https://numpydoc.readthedocs.io/en/latest/).
👉 [Example of numpy docstring with sphinx](https://sphinxcontrib-napoleon.readthedocs.io/en/latest/example_numpy.html).

An overview example,

::: code-output-equal
``` python
def ex_class(var1, var2):
    """
    Quick description.
    Longer description with `keywords`.

    Parameters
    ----------
    var1 : int
        Desc for var1.
    var2 : {0 or 'index', 1 or 'columns'}, default 0
        Long desc for var2. It may take a long line and we can break
        this like that.

    Returns
    -------
    Resampler object

    See Also
    --------
    groupby : Group by mapping, function, label, or list of labels.
    Series.resample : Resample a Series.

    Notes
    -----
    See the `user guide
    <https://pandas.pydata.org/pandas-docs/stable/user_guide/timeseries.html#resampling>`_
    for more.

    Examples
    --------
    Start by creating a series with 9 one minute timestamps.
    >>> index = 1 +1
    2
    Description for this example.
    """
    # some commands
    return return_values
```

```
Quick description.
Longer description with `keywords`.

Parameters
----------
var1 : int
    Desc for var1.
var2 : {0 or 'index', 1 or 'columns'}, default 0
    Long desc for var2. It may take a long line and we can break
    this like that.

Returns
-------
Resampler object

See Also
--------
groupby : Group by mapping, function, label, or list of labels.
Series.resample : Resample a Series.

Notes
-----
See the `user guide
<https://pandas.pydata.org/pandas-docs/stable/user_guide/timeseries.html#resampling>`_
for more.

Examples
--------
Start by creating a series with 9 one minute timestamps.
>>> index = 1 +1
2
Description for this example.
```
:::


Math equations,

<div class="col-2-equal">

``` python
# inline equation
"""
.. math:: \\drac{1}{2}
"""
```

``` python
# break very long equation
"""
.. math::
    x_{\\text{min}} + \\dfrac{1}
    {2} # for a very long equation
"""
```

``` python
# aligned
"""
.. math::
    x+y &= z

    1+2 &= 3
"""
```

``` python
# cases
"""
.. math::
    f(x) = \smash{
        \\begin{cases}
        0, &\\text{ if } x < 40, \\\\
        1, & \\text{ if } 40 \leq x <60, \\\\
        \\end{cases}
    }
"""
```
</div>

``` python
# Methof, url.
"""
Instantiate the class.

Parameters
----------
lst_comparison_type: str, default "wasserstein"
    Type of comparison. The supported types are in `dict_tests` which
    contains:

    - "pearsonr": `Pearson correlation coefficient
      <https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.pearsonr.html>`_.

    - "wasserstein": Wasserstein distance (earth mover's distance). It
      measures the distance between 2 distributions.
      Check :meth:`popai.distribution_wasserstein_score`.
"""
```

``` python
# long line url
"""
- "pearsonr": `Pearson correlation coefficient
  <https://docs.scipy.org/doc/scipy/reference/\
generated/scipy.stats.pearsonr.html>`_.
"""
```

<div class="col-2-equal">

``` python
# single returns
"""
Returns
-------
tuple (float, dict)
    Description.
"""
```

``` python
# return a tuple
"""
Returns
-------
reject : ndarray, boolean
    Description.
pvals_corrected : ndarray
    p-Description.
"""
```

``` python
# break lines in itemize
"""
Returns
-------
info: dict
    Description.

    - Item 1.
    - Item 2 very long lines
      can be broken here.
"""
```
</div>

### Google Style Python Docstring

👉 [Example Google Style Python Docstrings — napoleon 0.7 documentation](https://sphinxcontrib-napoleon.readthedocs.io/en/latest/example_google.html)
👉 [styleguide | Style guides for Google-originated open-source projects](https://google.github.io/styleguide/pyguide.html)

``` python
# function
"""
Args:
    param1 (int): The first parameter.
    param2 (str): The second parameter.

Returns:
    bool: The return value. True for success, False otherwise.
"""
```

## Errors

Problems with [VSCode](/visual-studio-code) which cannot run the preview:

- Select and activate an environment, `Ctrl + Shift + P` then choose `Python: Select Interpreter` then choose the right version of python you wanna run the docs on.
- Make sure the conda is already in `$PATH` + update the bashrc or zshrc (try `conda --version`).
- Make sure the right environement is activate in VSCode + all necessary libs are already istalled!


## References

- [Rest and Sphinx Memo](https://rest-sphinx-memo.readthedocs.io/en/latest/intro.html).
- **docutils** -- [Quick ref to rst format](https://docutils.sourceforge.io/docs/user/rst/quickref.html).
- **Thomas Cokelaer** -- [Sphinx and RST syntax guide](https://thomas-cokelaer.info/tutorials/sphinx/rest_syntax.html)
- **Sam Nicholls** -- [An idiot’s guide to Python documentation with Sphinx and ReadTheDocs](https://samnicholls.net/2016/06/15/how-to-sphinx-readthedocs/)
- **sphinx-doc** -- [Include documentation from docstrings](https://www.sphinx-doc.org/en/master/usage/extensions/autodoc.html)
- [Sphinx configuration](https://www.sphinx-doc.org/en/master/usage/configuration.html).