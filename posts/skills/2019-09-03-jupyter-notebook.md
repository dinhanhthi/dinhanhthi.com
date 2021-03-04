---
layout: post
title: "Jupyter Notebook"
tags: [Skills]
toc: true
icon: jupyter.png
keywords: "pip conda hotkey magic function display side by side dataframes previous output hotkeys install packages multiline commands shortcuts pip conda figures markdown cell code cell check info system autoreload inline history description of a function IPython sys display_side_by_side version update upgrade jupyter notebook on remote server OSError: [Errno 99] Cannot assign requested address Running as root is not recommended localhost port ssh connection Cannot assign requested address list of variable environement toc extension table of content docker docker-compose SHA1 sha password hashed"
---

{% assign img-url = '/img/post/python' %}

## Installation

### Jupyter notebook

<div class="col-2-equal">

~~~ bash
# BY PIP
pip install --upgrade pip
pip install --upgrade ipython jupyter
~~~

~~~ bash
# BY CONDA
conda install ipython jupyter
~~~
</div>

Or read more in [this note](/python-installation#jupyer-notebook).

If you meet error `OSError: [Errno 99] Cannot assign requested address`, try

~~~ bash
jupyter notebook --ip=127.0.0.1 --port=8080
# or
jupyter notebook --ip=127.0.0.1 --port=8080 --allow-root
~~~

### Setting up a password

``` bash
# create a juputer notebook config file
# it can be used for other settings
# https://jupyter-notebook.readthedocs.io/en/stable/public_server.html#prerequisite-a-notebook-configuration-file
jupyter notebook --generate-config

# create a new password
# note: sha1 cannot be reverted!!
jupyter notebook password
```

Inside notebook:

``` python
from notebook.auth import passwd
passwd()
```

With docker

``` bash
# create a sha1 password
# download file create_sha1.py from https://github.com/dinhanhthi/scripts
# run ./create_sha1.py

# docker-compose.yml
environment:
  - PASSWD='sha1:d03968479249:319e92302e68d601392918f011d6c9334493023f'

# Dockerfile
CMD /bin/bash -c 'jupyter lab --no-browser --allow-root --ip=0.0.0.0 --NotebookApp.password="$PASSWD" "$@"'
```

### R with jupyter notebook

Read more [here](https://irkernel.github.io/installation/#linux-panel).

``` bash
# install jupyter
sudo apt-get install libzmq3-dev libcurl4-openssl-dev libssl-dev jupyter-core jupyter-client

# install R on linux
sudo apt install r-base

# R kernel for Jupyter Notebook
R # enter R environnement
# install R kernel
install.packages(c('repr', 'IRdisplay', 'IRkernel'), type = 'source')
# or
install.packages(c('repr', 'IRkernel'), type = 'source')
# make jupyter see r kernel
IRkernel::installspec() # current user
IRkernel::installspec(user = FALSE) # global
```

``` bash
# embedded R
# use by cell magic %%R
pip install rpy2

# in a notebook
%load_ext rpy2.ipython

# then use
%%R
# R's codes
```

## Other tips

- Running 2 tasks in the same cell TAKE LONGER TIME than running each on different cells.
- Download a folder in jupyter notebook:
  - Inside notebook, use:

    ``` python
    %%bash
    tar -czf archive.tar.gz foldername
    ```
  - Or using [nbzip](https://github.com/data-8/nbzip) (only working on current server).

## Check the info

<div class="col-2-equal">

~~~ python
# function's info
?<func-name>
~~~

~~~ bash
# function's shortcode
??<func-name>
~~~

``` python
# get the list of current variables
whos
```
</div>

Check where command executed from (in your `$path`)?

::: code-output-equal
~~~ python
!type python
~~~

~~~
python is /Users/thi/anaconda/envs/python3.6/bin/python
~~~
:::

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

{% hsbox "Click to see the full list" %}

For both modes,

{:.indent}
- <kbd>Shift</kbd> + <kbd>Enter</kbd> run the current cell, select below.
- <kbd>Ctrl</kbd> + <kbd>Enter</kbd> run selected cells.
- <kbd>Alt</kbd> + <kbd>Enter</kbd> run the current cell, insert below.
- <kbd>Ctrl</kbd> + <kbd>S</kbd> save and checkpoint.

Command modes,

{:.indent}
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

{:.indent}
- <kbd>Esc</kbd> take you into command mode.
- <kbd>Tab</kbd> code completion or indent.
- <kbd>Ctrl</kbd> + <kbd>]</kbd> indent.
- <kbd>Ctrl</kbd> + <kbd>[</kbd> dedent.
- <kbd>Ctrl</kbd> + <kbd>A</kbd> select all.
- <kbd>Ctrl</kbd> + <kbd>Z</kbd> undo.
- <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd> or <kbd>Ctrl</kbd> + <kbd>Y</kbd> redo.

{% endhsbox %}

## Jupyter notebook on remote server

Open jupyter notebook in local browser but the backend-server is on remote.

- If jupyter server **is already** running on remote at `http://192.168.0.155:9889`,

  ~~~ bash
  ssh -N -L localhost:9888:192.168.0.155:9899 <username-remote>@<remote-host> -p <port>
  # if there is no port, remove `-p <port>`
  ~~~

  Open browser: `http://localhost:9888` (type password if needed).
- If jupyter server **is not** running on remote yet,

  ~~~ bash
  # connect to remote
  ssh <username-remote>@<remote-host> -p <port>
  # if there is no port, remove `-p <port>`
  ~~~

  On remote,

  ~~~ bash
  # run juputer with custom port
  jupyter notebook --no-browser --port=9899

  # if there is error `OSError: [Errno 99] Cannot assign requested address`
  jupyter notebook --ip=0.0.0.0 --no-browser --port=9899

  # if there is error `Running as root is not recommended`
  jupyter notebook --ip=0.0.0.0 --no-browser --port=9899 --alow-root
  ~~~

  It's running and there are somethings like that,

  ~~~ bash
  http://127.0.0.1:9889/?token=717d9d276f0537a9...831793df6319ad389accd
  ~~~

  Open another terminal window and type,

  ~~~ bash
  ssh -N -L localhost:9888:localhost:9889 <username-remote>@<remote-host> -p <port>
  # if there is no port, remove `-p <port>`
  # there is nothing but it's running
  ~~~

  Open browser:

  ``` bash
  http://localhost:9888/?token=717d9d276f0537a9...831793df6319ad389accd
  ```

You can choose any port number you wanna instead of `9888` and `9889` (they can be the same), note that, you need to use a port number GREATER THAN `8000`!

## Install new python package inside Jupyter Notebook

Using `conda`{% ref "https://jakevdp.github.io/blog/2017/12/05/installing-python-packages-from-jupyter/" %},

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

## Magic Functions

- Check the full list (in examples) [here](https://nbviewer.jupyter.org/github/ipython/ipython/blob/1.x/examples/notebooks/Cell%20Magics.ipynb) or their docs [here](https://ipython.readthedocs.io/en/stable/interactive/magics.html).
- You can define your custom magic functions [here](https://ipython.readthedocs.io/en/stable/config/custommagics.html).

Auto update the new updated modules (put at the beginning of the notebook)

~~~ bash
%load_ext autoreload
%autoreload 2 # Reload all modules every time before executing

%autoreload 0 # disable autoreloader
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

## Extensions

### Table of contents

1. Install [npm and nodejs](https://github.com/nodesource/distributions/blob/master/README.md#debinstall).
2. Install [this extension](https://github.com/jupyterlab/jupyterlab-toc).
3. Enable in jupyter lab view.
4. Refresh the page.

``` bash
# errors
# UnicodeDecodeError: 'ascii' codec can't decode byte 0xf0 in position 23: ordinal not in range(128)
npm config set unicode false
```

### Debugger

1. Install `xeus-python`, `jupyterlab`

  ``` bash
  pip install xeus-python
  pip install jupyterlab
  ```
2. Install [this extension](https://github.com/jupyterlab/debugger).
3. Refresh the page, you have to choose kernel _xpython_ (instead of _Python 3_) to use the debugger.


