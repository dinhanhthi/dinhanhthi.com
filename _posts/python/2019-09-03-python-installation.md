---
layout: post
title: "☀ Python Installation"
categories: [python]
---

{% assign img-url = '/img/post/python' %}

{% include toc.html %}

## Windows

Download and install [Anaconda](https://www.anaconda.com/distribution/). If it's too big, you can choose [Miniconda](https://docs.conda.io/en/latest/miniconda.html) instead. Suppose that the Anaconda is installed (by default) in:

{:.bg-gray}
~~~
C:\ProgramData\Anaconda3
~~~

Add below directories into *System Environment Variables*:

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

Using Windows' *command prompt* (cmd) or *PowerShell* as a command line environment. For me, I prefer [cmder](https://cmder.net/) (use [this setting]({{site.url}}{{site.baseurl}}/files/cmder_setting.xml) file).

### Jupyer Notebook

Anaconda contains JN in it, no need to install it again. `cd` to the folder you wanna work on and run

~~~ bash
python -m notebook
~~~

If you meet the error `ImportError: DLL load failed`, try:

~~~ bash
active base # active environment "base" in anaconda
jupyter notebook
~~~

## MacOS

*Updated later!*

## Linux (Ubuntu)

Python is already installed on Ubuntu. You would like to install Anaconda, [download and install](https://www.anaconda.com/distribution/) it.

Add Anaconda to the `$path`:

1. Open `~/.profile`.
2. Paste `export PATH=/home/<user>/anaconda3/bin:$PATH` (this is the default directory when you install anaconda)
3. Excute: `source ~/.profile` in order to immediately reflect changes to your current terminal instance
4. Check with `which python`, if it returns `/home/<user>/anaconda3/bin/python` then it works (`python -v` returns anaconda also).
5. If you wanna go back to the system default, open the `.bashrc` file and comment out settings of anaconda with `#`. That’s it!

On Ubuntu, I use [Guake Terminal](https://github.com/Guake/guake) to replace the system terminal. 

## Install new packages

### Install packages with pip

Install [pip](https://pypi.org/project/pip/) (It's actually installed with Anaconda). If you wanna upgrade it to the latest version:

~~~ bash
python -m pip install --user --upgrade pip # install for current user only
python -m pip install --upgrade pip # need to run cmder as administrator
~~~

{% hsbox AttributeError: 'NoneType' object %}

First, `activate <env>` and then using `easy_install -U pip`. You can check the version of pip by `pip -V`.

{% endhsbox %} 

Install a package with pip:

~~~ bash
pip install <package> # administrator <-- SHOULDN'T!!!
pip install --user <package> # current user only
~~~

Check the version & info of a package:

~~~ bash
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
activate <env> # you need to activate an environment first
conda install <package> # install for <env> only
~~~

Update,

~~~ bash
acctivate <env> # choose an env first
conda update <package> # ud package in that env
~~~

List all installed packages (in `<env>`),

~~~ bash
conda list
~~~

Update packages listed in an env file to current env,

~~~ bash
conda env update -n <env> -f /path/to/<file>.yml
~~~

### pip vs conda?

Differences:<sup>[[ref]](https://jakevdp.github.io/blog/2017/12/05/installing-python-packages-from-jupyter/)</sup>

- `pip` installs **python packages** in **any environment**.
- `conda` installs **any package** in **conda environments**.

Which one to be used?<sup>[[ref]](https://jakevdp.github.io/blog/2017/12/05/installing-python-packages-from-jupyter/)</sup>

- If you installed Python using Anaconda or Miniconda, then use `conda` to install Python packages. If `conda` tells you the package you want doesn't exist, then use `pip` (or try `conda-forge`, which has more packages available than the default conda channel).
- If you installed Python any other way (from source, using `pyenv`, `virtualenv`, etc.), then use `pip` to install Python packages

## Install Jupyter Notebook

By using pip,

~~~ bash
# first, always upgrade pip!
pip install --upgrade pip
pip install --upgrade ipython jupyter
~~~

By using conda,

~~~ bash
conda install ipython jupyter
~~~

## Conda

### Install conda without Anaconda

You can even install `conda` using `pip` (without installing Anaconda / Minianaconda):

~~~ bash
pip install conda
~~~

### Update conda

~~~ bash
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

# The same python version with current shell's Python interpreter
conda create -n <env-name> python 

# with addtional packages (python will be automatically installed)
conda create -n <env-name> <package1> <package2>
# with version
conda create -n <env-name> <package1>=1.16 <package2>

# in different directory
conda create --prefix /path/to/<env-name>

# create from file <file>.yml
conda env create -n <env> -f /path/to/<file>.yml

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

conda env export -f <file>.yml                       # <env> activated & current folder
conda env export -n <env> -f /path/to/<file>.yml      # <env> isn't activated & different folder
conda update -p /path/to/<env> -f /path/to/<file>.yml # <env> isn't in the default directory of conda & different folder
~~~
</div>


Deactivate an env:

~~~ bash
conda deactivate # Linux
deactivate # Windows
source deactivate # MacOS
~~~

Remove an env,

~~~ bash
conda remove -n <env> --all
~~~

Show the list of current envs:

~~~ bash
conda info --envs
# or
conda env list
~~~

Export to an env file,

~~~ bash
conda env export -f <file>.yml
~~~

Create from file,

~~~ bash
conda env create -n <env> -f /path/to/<file>.yml
~~~

Update packages listed in an env file to current env,

~~~ bash
conda env update -n <env> -f /path/to/<file>.yml --prune
~~~

Clone from another env,

~~~ bash
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

Check revisions,

~~~ bash
conda list --revisions
~~~

Go back to revision `1`,

~~~ bash
conda install --revision 1
~~~