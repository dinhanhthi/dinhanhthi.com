---
layout: post
title: "Python Installation"
tags: [Python]
toc: true
icon: "/img/about/python.svg"
keywords: "windows linux mac anaconda pip jupyter notebook activate base ubuntu install new packages conda env environement revision ImportError ssl error ssh module _ssl TLS/SSL check version update pip upgrade pip AttributeError: 'NoneType' object UnicodeDecodeError: 'ascii' codec conda: The following packages are not available from current channels freetype (from matplotlib) dtaidistance: C-library is not available"
date: 2021-10-29
---

## Windows

✅ __Update 11/Sep/20__: Install python [on WSL2](/docker-wsl2-windows) using [**Miniconda**](#linux-ubuntu).

::: hsbox Other options (directly install)
Download and install [Anaconda](https://www.anaconda.com/distribution/) or smaller version [Miniconda](https://docs.conda.io/en/latest/miniconda.html).

~~~ bash
# default installed dir
C:\ProgramData\Anaconda3
~~~

Add to *System Environment Variables*:

~~~ bash
C:\ProgramData\Anaconda3
C:\ProgramData\Anaconda3\Scripts
~~~

If you don't wanna use Anaconda and [install it by yourself](https://www.python.org/downloads/), add this:

~~~ bash
C:\Users\<user>\AppData\Roaming\Python\Python36\Scripts
~~~

(*You can find `C:\...\Roaming` by typing `%appdata%` in the Windows Explorer's navigation bar*)

App to run: [cmder](https://cmder.net/) (use [this setting]({{site.url}}{{site.baseurl}}/files/cmderSetting.xml) file).
:::

## MacOS

::: hsbox **If you use Apple M1** (updated on 21/02/2021)?

<div class="warning">

AI things are limited! Pytorch is not available for M1 natively (If you wanna use it with Rosetta's help, read [this article](https://naturale0.github.io/machine%20learning/setting-up-m1-mac-for-both-tensorflow-and-pytorch))!
</div>

<div class="info">

💡 If you wanna install python2 environment, don't use `conda create ...`, use `pyenv` instead! Read [this section](#pyenv) for more.
</div>

:point_right: [Instructions to install TensorFlow in a Conda Environment](https://github.com/apple/tensorflow_macos/issues/153)

``` bash
conda init # after installing
# restart terminal after installing
# check if ok
which python # should return "/Users/thi/miniforge3/bin/python"

# manually install package
conda install <pkg name>
conda install -y <pkg> # auto accept
```

If you use conda (miniforge3), use the instructions in previous link to install tensorflow (not about the link to "newest" version of tensorflow-macos). If you wanna use python on your mac (using `venv`), check below link.

:point_right: [Mac-optimized TensorFlow and TensorFlow Addons](https://github.com/apple/tensorflow_macos)

__Remark__: After installing, check the version of `tensorflow-macos` (not `tensorflow`)

``` bash
pip show tensorflow-macos
```

__Remark__: If you wanna install some package, use `conda install -y <pkg>`, then check its version by `pip show <pkg>`.

:point_right: Using [my personal requirement file](https://github.com/dinhanhthi/scripts/blob/master/settings/macos/requirement_m1.txt).

``` bash
conda install --file requirement_m1.txt
```
:::

By default, Python 2 is already installed on MacOS, you can check this by

~~~ bash
python --version
# to be sure, check if python3 is installed?
python3 --version
~~~

## Linux (Ubuntu)

Python is already installed on Ubuntu. You would like to install Anaconda, [download and install](https://www.anaconda.com/distribution/) it.

Wanna install __Miniconda__ instead? 👉 Download[ `.sh` file](https://docs.conda.io/en/latest/miniconda.html#linux-installers) and install inside Linux environement (including [WSL2](/docker-wsl2-windows)).

{% hsbox "Miniconda or Conda? ([ref](https://stackoverflow.com/questions/45421163/anaconda-vs-miniconda#:~:text=Note%20that%20Conda%20is%20the,Anaconda%20and%20Miniconda%20are%20distributions.&text=Miniconda%20is%20essentially%20an%20installer,Source.))" %}
Note that [Conda](https://conda.io/projects/conda/en/latest/) is the _package manager_ (e.g. `conda list` displays all installed packages in the environment), whereas Anaconda and Miniconda are distributions.

Choose Anaconda if you:

- Are new to conda or Python
- Like the convenience of having Python and over 1500 scientific packages automatically installed at once
- Have the time and disk space (a few minutes and 3 GB), and/or
- Don’t want to install each of the packages you want to use individually.

Choose Miniconda if you:

- Do not mind installing each of the packages you want to use individually.
- Do not have time or disk space to install over 1500 packages at once, and/or
- Just want fast access to Python and the conda commands, and wish to sort out the other programs later.

{% endhsbox %}

{% hsbox "Add conda to `$PATH`" %}
~~~ bash
# ADD CONDA TO $PATH

nano ~/.profile
# find where conda is installed and then
export PATH=/home/<user>/anaconda3/bin:$PATH
source ~/.profile

# (if you use zsh)
nano ~/.zshrc
export PATH=/home/<user>/anaconda3/bin:$PATH
source ~/.zshrc

# check
which python
# should return: /home/<user>/anaconda3/bin/python

# check version
conda --version
~~~
{% endhsbox %}

{% hsbox "Make a right version" %}
``` bash
alias python=python3
alias pip=pip3
# for ubuntu >=20.04
sudo apt install python-is-python3
# prevent Python 2 from being installed as a dependency of something
sudo apt-mark hold python2 python2-minimal python2.7 python2.7-minimal libpython2-stdlib libpython2.7-minimal libpython2.7-stdlib
```
{% endhsbox %}

## Jupyer Notebook

👉 Note: [Jupyter notebook](/jupyter-notebook/).

::: success
If you use [VSCode](/visual-studio-code/), you should use its Jupyter Notebook extension, it's quick, clean and very easy to use.
:::

Anaconda contains JN in it, no need to install it again. `cd` to the folder you wanna work on and run

::: code-2cols
~~~ bash
# RUN (after installing Anaconda)
python -m notebook
~~~

~~~ bash
# If `ImportError: DLL load failed`
active base # active env "base" in anaconda
jupyter notebook
~~~
:::

The `-m` option allows you to execute a module or package as a script{% ref "https://www.quora.com/What-does-m-mean-in-the-terminal-command-Python-m-pip-install-openpyxl" %}.

~~~ bash
# If `import _ssl`, `ImportError`
set CONDA_DLL_SEARCH_MODIFICATION_ENABLE=1
python -m notebook
~~~

## Check GPU

👉 Note: [Pytorch](/pytorch#problem-with-cuda-version).

``` python
# with pytorch
import torch
print('cuda is available? ', torch.cuda.is_available())
print('device_count: ', torch.cuda.device_count())
print('current device: ', torch.cuda.current_device())
print('device name: ', torch.cuda.get_device_name(0))
```

``` python
# with tensorflow
import tensorflow as tf
print("Num GPUs Available: ", len(tf.config.experimental.list_physical_devices('GPU')))

```

## pip

### Update pip

::: code-2cols
~~~ bash
# Check pip version
pip -V
~~~

~~~ bash
# update pip
easy_install -U pip
~~~
:::

{% hsbox "Problem?" %}
- If you meet `AttributeError: 'NoneType' object has no attribute 'bytes'` when updating `pip`, check the version and make sure that there is only 1 pip on your computer and then use `easy_install -U pip` (don't forget to `activate `)
- If there is a problem with `python -m pip install --upgrade pip`, use `easy_install`!
{% endhsbox %}

### Install packages with pip

Install [pip](https://pypi.org/project/pip/) (It's actually installed with Anaconda). If you wanna upgrade it to the latest version:

~~~ bash
python -m pip install --user --upgrade pip # install for current user only
python -m pip install --upgrade pip # need to run cmder as administrator
~~~

::: hsbox `AttributeError: 'NoneType' object`
First, `activate <env>` and then using `easy_install -U pip`. You can check the version of pip by `pip -V`.
:::

~~~ bash
# INSTALL A PACKAGE
pip install <package> # admin <-- SHOULDN'T!!!
pip install --user <package> # current user only
~~~

<div class="col-2-equal">

~~~ bash
# LIST ALL INSTALLED PACKAGES
pip freeze
~~~

``` bash
# REMOVE
pip uninstall <package>
pip uninstall --user <package>
```

~~~ bash
# CHECK VERSION OF A PACKAGE
pip show <package>
~~~

``` bash
# version <=
pip3 install -U "pillow<7"
```
</div>

``` bash
# Install a package from a git repository
pip install git+https://github.com/TimeSynth/TimeSynth.git
```

If install packages with `pip`, they are installed in which environment of conda? Where `pip` is executed from.

::: code-output-flex
~~~ bash
which python
which pip

conda info --envs
# or
# conda env list
~~~

~~~
/c/ProgramData/Anaconda3/python
/c/ProgramData/Anaconda3/Scripts/pip

# conda environments:
base                  *  C:\ProgramData\Anaconda3
fastai                   C:\Users\thi\.conda\envs\fastai
~~~
:::

Install packages with requirement file,

~~~ bash
pip install -r requirements.txt
~~~

::: hsbox An example of requirement file
~~~ bash
geopandas==0.4.1
grpcio==1.27.1
grpcio-tools==1.27.1
h5py==2.10.0
isodate==0.6.0
PyYAML==5.3.1
~~~
:::

## `pip` vs `conda`?

👌 **Fact**: each conda environment has a `pip`, just install package in each env with the corresponding `pip`.

``` bash
conda activate base
which pip # /Users/thi/miniforge3/bin/pip

conda activate working
which pip # /Users/thi/miniforge3/envs/working/bin/pip
```

::: hsbox Old comments
Differences:{% ref "https://jakevdp.github.io/blog/2017/12/05/installing-python-packages-from-jupyter" %}

- `pip` installs **python packages** in **any environment**.
- `conda` installs **any package** in **conda environments**.

Which one to be used?{% ref "https://jakevdp.github.io/blog/2017/12/05/installing-python-packages-from-jupyter" %}

- If you installed Python using Anaconda or Miniconda, then use `conda` to install Python packages. If `conda` tells you the package you want doesn't exist, then use `pip` (or try `conda-forge`, which has more packages available than the default conda channel).
- If you installed Python any other way (from source, using `pyenv`, `virtualenv`, etc.), then use `pip` to install Python packages
:::

## Python virtual environnement

👌 **Fact**: For a simple life, use conda environment!

::: hsbox Click to show
👉🏻 Main guide is [here](https://packaging.python.org/tutorials/installing-packages/#creating-virtual-environments).

``` bash
sudo apt-get install python3-venv

# cd to <DIR> where python venv stored
python3 -m venv <DIR>

# activate
tutorial-env\Scripts\activate.bat # windows
source <DIR>/bin/activate # linux

# deactivate
deactivate
```

To detele, just remove the corresponding folder, i.e., `<DIR>`.
:::

## pyenv{:#pyenv}

👉🏻 Read more [on SO](https://stackoverflow.com/questions/58044214/installing-anaconda-with-pyenv-unable-to-configure-virtual-environment). Note that, these methods didn't work on MacOS M1.

## Conda

### Install / Update conda

👉 Read more in [this section](#linux-(ubuntu)).

::: col-2-equal
~~~ bash
# INSTALL CONDA BY PIP (without Anaconda)
pip install conda
~~~

~~~ bash
# UPDATE CONDA
conda --version # check version
conda update -n base -c defaults conda
~~~
:::

::: hsbox Error `TypeError: LoadLibrary() argument 1 must be str, not None`
Try to activate the environment `base` before running above line.

~~~ bash
activate base # on Windows
source activate base # on MacOS
~~~
:::

### Install packages with conda

👌 **Fact**: Activate an environment conda, use its `pip` to install any package.

{% hsbox "Like using `conda`?" %}

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

::: col-2-equal
~~~ bash
# LIST ALL INSTALLED PACKAGES
conda list
~~~

``` bash
# check version of a package
pip show <pkg>
```
:::

~~~ bash
# Update packages listed in an env file to current env,
conda env update -n <env> -f /path/to/<file>.yml
~~~

~~~ bash
# example of yml file
name: stats
dependencies:
    - python=3.6
    - geopandas==0.4.1
~~~

``` bash
# install packages with requirements.txt
conda install --file requirements.txt
```
{% endhsbox %}

### Environment

👉 Check an [official doc](https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html) or [this useful post](https://towardsdatascience.com/a-guide-to-conda-environments-bc6180fc533).


::: hsbox Creating
~~~ bash
# Create a new environment with python version 3.7
conda create -n <env-name> python=3.7 anaconda
# created in /home/thi/miniconda3/envs/<env-name>/
source activate <env-name> # activate this env
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
:::

::: warning
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
:::

<div class="col-2-equal">

``` bash
# Activate an env
activate <env> # windows
source activate <env> # linux / macos
```

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
# Update packages listed in an env file to current env,
conda env update -n <env> -f /path/to/<file>.yml --prune
~~~

{% hsbox "Show activated env in [zsh](/terminal/#zsh-linux)" %}
``` bash
# run this first in your current shell
conda init zsh
# other options than zsh: bash, powershell, ...
source ~/.zshrc
```

If you wanna hide `(base)` in prompt,

``` bash
conda config --set changeps1 false
# don't forget to reset the terminal
```

{% endhsbox %}

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

::: code-2cols
~~~ bash
# Check revisions
conda list --revisions
~~~

~~~ bash
# Go back to revision `1`,
conda install --revision 1
~~~
:::

## Error?

``` bash
# UnicodeDecodeError: 'ascii' codec can't decode byte 0xe2 in position 975: ordinal not
# solution: instead of
pip3 install sesd
# use
LC_ALL=C.UTF-8 pip3 install sesd
```

``` bash
# conda: The following packages are not available from current channels:
# Solution 1: One can use pip in this case (the same env with conda)
# Solution 2:
conda install -c anaconda <package>
```

``` bash
# The following required packages can not be built: * freetype (from matplotlib)
# try to use conda to install matplotlib
conda install matplotlib
# it actually install the same thing as pip does on the same env
```

``` bash
# dtaidistance: C-library is not available
pip install -vvv --upgrade --force-reinstall dtaidistance
```

``` bash
# zsh: command not found: conda
# Make sure your installation folder is already
# in the $PATH
export PATH="/home/thi/miniconda3/bin:$PATH"
```