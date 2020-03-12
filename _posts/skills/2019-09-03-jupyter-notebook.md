---
layout: post
title: "Jupyter Notebook"
categories: [skills]
icon-photo: jupyter.png
keywords: "pip conda hotkey magic function display side by side dataframes previous output hotkeys install packages multiline commands shortcuts pip conda figures markdown cell code cell check info system autoreload inline history description of a function IPython sys display_side_by_side version update upgrade"
date: 2020-03-02
---

{% assign img-url = '/img/post/python' %}

{% include toc.html %}

## Installation

By using pip,

~~~ bash
pip install --upgrade pip # first, always upgrade pip!
pip install --upgrade ipython jupyter
~~~

By using conda,

~~~ bash
conda install ipython jupyter
~~~

Or read more in [this note](/python-installation).

## Other tips

- Running 2 tasks in the same cell TAKE LONGER TIME than running each on different cells.

## Multiline commands

~~~ python
# Using '\'
df.columns = df.columns.str.replace('.', ' ')\
                       .str.replace('\s+', ' ')\
                       .str.strip().str.upper()
~~~

You CANNOT put `# comments` at the end of each line break!

## Hotkeys / Shortcuts

There are 2 modes: **command mode** (pres <kbd>ESC</kbd> to activate) and **edit mode** (<kbd>Enter</kbd> to activate). Below are the most useful ones (for me).

You can edit / add more shortcuts in **Help** > **Edit Keyboard Shortcuts**.

<div class="hide-show-box">
<button type="button" markdown="1" class="btn collapsed box-button" data-toggle="collapse" data-target="#box1ct">
Click to see the full list
</button>
<div id="box1ct" markdown="1" class="collapse multi-collapse box-content">

For both modes,

- <kbd>Shift</kbd> + <kbd>Enter</kbd> run the current cell, select below.
- <kbd>Ctrl</kbd> + <kbd>Enter</kbd> run selected cells.
- <kbd>Alt</kbd> + <kbd>Enter</kbd> run the current cell, insert below.
- <kbd>Ctrl</kbd> + <kbd>S</kbd> save and checkpoint.

Command modes,

- <kbd>Enter</kbd> take you into edit mode.
- <kbd>H</kbd> show all shortcuts.
- <kbd>Up</kbd> / <kbd>Down</kbd> select cell above / below.
- <kbd>Shift</kbd> + <kbd>Up</kbd> / <kbd>Down</kbd> extend selected cells above / below.
- <kbd>A</kbd> / <kbd>B</kbd> insert cell above / below.
- <kbd>X</kbd> cut selected cells.
- <kbd>C</kbd> copy selected cells.
- <kbd>V</kbd> / <kbd>Shift</kbd> + <kbd>V</kbd> paste cells below / above.
- <kbd>D</kbd>, <kbd>D</kbd> (press the key twice) delete selected cells.
- <kbd>Z</kbd> undo cell deletion.
- <kbd>S</kbd> Save and Checkpoint.
- <kbd>Y</kbd> change the cell type to Code.
- <kbd>M</kbd> change the cell type to Markdown.

Edit mode,

- <kbd>Esc</kbd> take you into command mode.
- <kbd>Tab</kbd> code completion or indent.
- <kbd>Ctrl</kbd> + <kbd>]</kbd> indent.
- <kbd>Ctrl</kbd> + <kbd>[</kbd> dedent.
- <kbd>Ctrl</kbd> + <kbd>A</kbd> select all.
- <kbd>Ctrl</kbd> + <kbd>Z</kbd> undo.
- <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd> or <kbd>Ctrl</kbd> + <kbd>Y</kbd> redo.

</div>
</div>

## Install new python package inside Jupyter Notebook

Using `conda`<sup>[[ref]](https://jakevdp.github.io/blog/2017/12/05/installing-python-packages-from-jupyter/)</sup>,

~~~ python
# Install a conda package in the current Jupyter kernel
import sys
!conda install --yes --prefix {sys.prefix} numpy

# DON'T DO THIS
!conda install --yes numpy
~~~

Using `pip`,

~~~ python
# Install a pip package in the current Jupyter kernel
import sys
!{sys.executable} -m pip install numpy

# DON'T DO THIS
!pip install numpy
~~~

Check version and update/upgrade,

~~~ python
!pip show pandas

~~~

## Display dataframes side-by-side

~~~ python
from IPython.display import display_html
def display_side_by_side(*args):
    html_str=''
    for df in args:
        html_str+=df.to_html()
    display_html(html_str.replace('table','table style="display:inline; margin-right: 5px;"'),raw=True)
~~~

~~~ python
display_side_by_side(df1,df2,df1)
~~~

## Get previous outputs

~~~ python
_ # previous output
__ # second-to-last output
___ # third-to-last output
~~~

## Display 2 figures side-by-side markdown cell

Put below codes in the markdown cell of Jupyter Notebook.

~~~ html
<tr>
  <td> <img src="Nordic_trails.jpg" alt="Drawing" style="width: 250px;"/> </td>
  <td> <img src="Nordic_trails.jpg" alt="Drawing" style="width: 250px;"/> </td>
</tr>
~~~

## Check the info

Check the info of a function (gives us the documentation):

~~~ bash
?<func-name>
~~~

Check the shortcodes of a function:

~~~ bash
??<func-name>
~~~

Check where command executed from (in your `$path`)?

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ python
!type python
~~~

{:.output.flex-fill.d-flex}
~~~
python is /Users/thi/anaconda/envs/python3.6/bin/python
~~~
</div>

## Magic Functions

- Check the full list (in examples) [here](https://nbviewer.jupyter.org/github/ipython/ipython/blob/1.x/examples/notebooks/Cell%20Magics.ipynb) or their docs [here](https://ipython.readthedocs.io/en/stable/interactive/magics.html).
- You can define your custom magic functions [here](https://ipython.readthedocs.io/en/stable/config/custommagics.html).

Auto update the new updated modules (put at the beginning of the notebook)

~~~ bash
%load_ext autoreload
%autoreload 2
~~~

Check more settings of `%autoreload` [here](https://ipython.org/ipython-doc/3/config/extensions/autoreload.html).

Show the plots inside the notebook:

~~~ bash
%matplotlib inline
~~~

Get the commands from 1 to 4:

~~~ python
%history -n 1-4 # get commands 1 to 4
~~~





