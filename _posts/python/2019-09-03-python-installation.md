---
layout: post
title: "Python Installation"
categories: [python]
tags: ['101', installation, python]
keywords: "windows linux mac anaconda pip jupyter notebook activate base ubuntu install new packages conda env environement revision ImportError ssl error ssh module _ssl TLS/SSL check version update pip upgrade pip AttributeError: 'NoneType' object"
---

{% assign img-url = '/img/post/python' %}

{% include toc.html %}

## Windows

Download and install [Anaconda](https://www.anaconda.com/distribution/) or smaller version [Miniconda](https://docs.conda.io/en/latest/miniconda.html).

{:.bg-gray}
~~~
# default installed dir
C:\ProgramData\Anaconda3
~~~

Add to *System Environment Variables*:

{:.bg-gray}
~~~
C:\ProgramData\Anaconda3
C:\ProgramData\Anaconda3\Scripts
~~~

If you don't wanna use Anaconda and [install it by yourself](https://www.python.org/downloads/), add this:

{:.bg-gray}
~~~
C:\Users\<user>\AppData\Roaming\Python\Python36\Scripts
~~~

(*You can find `C:\...\Roaming` by typing `%appdata%` in the Windows Explorer's navigation bar*)

App to run: [cmder](https://cmder.net/) (use [this setting]({{site.url}}{{site.baseurl}}/files/cmderSetting.xml) file).

### Jupyer Notebook

Anaconda contains JN in it, no need to install it again. `cd` to the folder you wanna work on and run

<div class="flex-auto-equal-2" markdown="1">
~~~ bash
# RUN (after installing Anaconda)
python -m notebook
~~~

~~~ bash
# If `ImportError: DLL load failed`
active base # active env "base" in anaconda
jupyter notebook
~~~
</div>

~~~ bash
# If `import _ssl`, `ImportError`
set CONDA_DLL_SEARCH_MODIFICATION_ENABLE=1
python -m notebook
~~~

## MacOS

By default, Python 2 is already installed on MacOS, you can check this by 

~~~ bash
python --version
# to be sure, check if python3 is installed?
python3 --version
~~~

## Linux (Ubuntu)

Python is already installed on Ubuntu. You would like to install Anaconda, [download and install](https://www.anaconda.com/distribution/) it.

~~~ bash
bash Anaconda...sh
~~~

Add Anaconda to the `$path`:

1. Open `~/.profile`.
2. Paste `export PATH=/home/<user>/anaconda3/bin:$PATH` (this is the default directory when you install anaconda)
3. Excute: `source ~/.profile` in order to immediately reflect changes to your current terminal instance
4. Check with `which python`, if it returns `/home/<user>/anaconda3/bin/python` then it works (`python -v` returns anaconda also).
5. If you wanna go back to the system default, open the `.bashrc` file and comment out settings of anaconda with `#`. That’s it!

On Ubuntu, I use [Guake Terminal](https://github.com/Guake/guake) to replace the system terminal. 

## Install new packages

### Update pip

<div class="flex-auto-equal-2" markdown="1">
~~~ bash
# Check pip version
pip -V
~~~

~~~ bash
# update pip
easy_install -U pip
~~~
</div>

- If you meet `AttributeError: 'NoneType' object has no attribute 'bytes'` when updating `pip`, check the version and make sure that there is only 1 pip on your computer and then use `easy_install -U pip` (don't forget to `activate `)
- If there is a problem with `python -m pip install --upgrade pip`, use `easy_install`!

### Install packages with pip

Install [pip](https://pypi.org/project/pip/) (It's actually installed with Anaconda). If you wanna upgrade it to the latest version:

~~~ bash
python -m pip install --user --upgrade pip # install for current user only
python -m pip install --upgrade pip # need to run cmder as administrator
~~~

{% hsbox AttributeError: 'NoneType' object %}

First, `activate <env>` and then using `easy_install -U pip`. You can check the version of pip by `pip -V`.

{% endhsbox %} 

~~~ bash
# LIST ALL INSTALLED PACKAGES
pip freeze
~~~

~~~ bash
# INSTALL A PACKAGE
pip install <package> # administrator <-- SHOULDN'T!!!
pip install --user <package> # current user only
~~~

~~~ bash
# CHECK VERSION OF A PACKAGE
pip show <package>
~~~

If install packages with `pip`, they are installed in which environment of conda? Where `pip` is executed from.

<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
~~~ bash
which python
which pip

conda info --envs
# or
# conda env list
~~~

{:.output.flex-fill.d-flex}
~~~
/c/ProgramData/Anaconda3/python
/c/ProgramData/Anaconda3/Scripts/pip

# conda environments:
base                  *  C:\ProgramData\Anaconda3
fastai                   C:\Users\thi\.conda\envs\fastai
~~~
</div>

### Install packages with conda

~~~ bash
# INSTALL
activate <env> # you need to activate an environment first
conda install <package> # install for <env> only
~~~

~~~ bash
# UPDATE
acctivate <env> # choose an env first
conda update <package> # ud package in that env
~~~

~~~ bash
# LIST ALL INSTALLED PACKAGES
conda list
~~~

~~~ bash
# Update packages listed in an env file to current env,
conda env update -n <env> -f /path/to/<file>.yml
~~~

### `pip` vs `conda`?

Differences:<sup>[[ref]](https://jakevdp.github.io/blog/2017/12/05/installing-python-packages-from-jupyter/)</sup>

- `pip` installs **python packages** in **any environment**.
- `conda` installs **any package** in **conda environments**.

Which one to be used?<sup>[[ref]](https://jakevdp.github.io/blog/2017/12/05/installing-python-packages-from-jupyter/)</sup>

- If you installed Python using Anaconda or Miniconda, then use `conda` to install Python packages. If `conda` tells you the package you want doesn't exist, then use `pip` (or try `conda-forge`, which has more packages available than the default conda channel).
- If you installed Python any other way (from source, using `pyenv`, `virtualenv`, etc.), then use `pip` to install Python packages

## Install Jupyter Notebook

<div class="flex-auto-equal-2" markdown="1">
~~~ bash
# USING PIP
# first, always upgrade pip!
pip install --upgrade pip
pip install --upgrade ipython jupyter
~~~

~~~ bash
# USING CONDA
conda install ipython jupyter
~~~
</div>

## Conda

### Install / Update conda

~~~ bash
# INSTALL CONDA BY PIP (without Anaconda)
pip install conda
~~~

~~~ bash
# UPDATE CONDA
conda update -n base -c defaults conda
~~~

If there is an error `TypeError: LoadLibrary() argument 1 must be str, not None` at the end of the log, try to activate the environment `base` before running above line.

~~~ bash
activate base # on Windows
source activate base # on MacOS
~~~

### Environment

Check an official doc [here](https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html) or [this useful post](https://towardsdatascience.com/a-guide-to-conda-environments-bc6180fc533).

Create a new environment with python version 3.7:

~~~ bash
conda create -n <env-name> python=3.7 anaconda
~~~

~~~ bash
# The same python version with current shell's Python interpreter
conda create -n <env-name> python 
~~~

~~~ bash
# with addtional packages (python will be automatically installed)
conda create -n <env-name> <package1> <package2>
# with version
conda create -n <env-name> <package1>=1.16 <package2>
~~~

~~~ bash
# in different directory
conda create --prefix /path/to/<env-name>
~~~

~~~ bash
# create from file <file>.yml
conda env create -n <env> -f /path/to/<file>.yml
~~~

~~~ bash
# Clone from another env
conda create --name <cloned-env> --clone <env>
~~~

<div class="alert alert-warning" markdown="1">

{:.mb-3}
Most of below commands are assumed to be run in an environment named `env` which is already activated. If you don't activate any environment before, use an alternative instead. For example,

~~~ bash
conda update pandas             # <env> activated
conda update -n <env> pandas    # <env> isn't activated
conda update -p /path/to/<env>  # <env> isn't in the default directory of conda
~~~

~~~ bash
conda env export -f <file>.yml                       # <env> activated & current folder
conda env export -n <env> -f /path/to/<file>.yml      # <env> isn't activated & different folder
conda update -p /path/to/<env> -f /path/to/<file>.yml # <env> isn't in the default directory of conda & different folder
~~~
</div>

<div class="flex-auto-equal-2" markdown="1">
~~~ bash
# DEACTIVE AN ENV
conda deactivate # Linux
deactivate # Windows
source deactivate # MacOS
~~~

~~~ bash
# REMOVE AN ENV
conda remove -n <env> --all
~~~

~~~ bash
# SHOW LIST OF CURRENT ENV
conda info --envs
# or
conda env list
~~~

~~~ bash
# EXPORT TO A ENV FILE
conda env export -f <file>.yml
~~~
</div>

~~~ bash
# CREATE FROM FILE
conda env create -n <env> -f /path/to/<file>.yml
~~~

~~~ bash
# Update packages listed in an env file to current env,
conda env update -n <env> -f /path/to/<file>.yml --prune
~~~

~~~ bash
# Clone from another env,
conda create --name <cloned-env> --clone <env>
~~~

### Kernel 2 & 3 for Jupyter Notebook

Check if `nb_conda_kernels` is installed by `conda list`. If not, install it by:

~~~ bash 
conda install nb_conda_kernels
~~~

If you are using **Python 2** and you wanna separate **Python 3**,

~~~ bash 
conda create -n py37 python=3.7 ipykernel # "py37" is a custom name
~~~

If you are using **Python 3** and you wanna separate **Python 2**,

~~~ bash 
conda create -n py27 python=2.7 ipykernel # "py37" is a custom name
~~~

Restart the Jupyter Notebook, the list of kernels is available under **New**.

### Conda Revisions

<div class="flex-auto-equal-2" markdown="1">
~~~ bash
# Check revisions
conda list --revisions
~~~

~~~ bash
# Go back to revision `1`,
conda install --revision 1
~~~
</div>