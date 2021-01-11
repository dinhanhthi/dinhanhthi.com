---
layout: post
title: "Google Colab"
tags: [Skills]
toc: true
icon: colab.png
keywords: "github notebook google drive hotkey TensorFlow pytorch gpu import library git with colab upload a file to colab 7zip zip graphviz pydot cartopy save as html keep google colab open awake prevent from disconnect"
---

{% assign img-url = '/img/post/skills' %}

## URLs

- [Main site](https://colab.research.google.com/).
- [Welcome site](https://colab.research.google.com/notebooks/welcome.ipynb?authuser=1).
- [SeedBank by Google](https://research.google.com/seedbank/): Collection of Interactive Machine Learning Examples.

## Colab & Github

"*Open with Colab*" any Jupyter Notebook file (`.ipynb`) in Github. For example, the file's URL is:

~~~ bash
https://github.com/dinhanhthi/dataquest-aio/blob/master/file-name.ipynb
~~~

You can open with colab with the URL:

~~~ bash
https://colab.research.google.com/github/dinhanhthi/dataquest-aio/blob/master/file-name.ipynb
~~~

In the case you wanna import dataset (`.csv`) from Github. First, open this `.csv` file as RAW. Its URL may be

~~~ bash
https://raw.githubusercontent.com/dinhanhthi/dataquest-aio/master/file.csv
~~~

and then use it as the url of the data file. Note that, you cannot use `open` to read this file,

~~~ python
import csv

# We can use on localhost
opened_file = open(dataset_url, encoding="utf8")
read_file = csv.reader(opened_file)

# But we CAN'T use this `open` for the link from Github, we use:
from urllib.request import urlopen
opened_file = urlopen(dataset_url).read().decode('utf-8')
read_file = csv.reader(opened_file.splitlines())
~~~


## Hotkeys / Shortcuts

Check the command shortcuts in **Tools** > **Keyboard shortcuts** (<kbd>Ctrl</kbd> + <kbd>M</kbd> <kbd>H</kbd>), below are the most popular ones:

- <kbd>Ctrl</kbd> + <kbd>S</kbd>: **save** the notebook.
- <kbd>Ctrl</kbd> + <kbd>Enter</kbd>: **run** a cell in place.
- <kbd>Shift</kbd> + <kbd>Enter</kbd>: to **run** the cell and move **focus** to the next cell (adding one if none exists).
- <kbd>Alt</kbd> + <kbd>Enter</kbd>: **run** the cell and **insert** a new code cell immediately below it.
- <kbd>Ctrl</kbd> + <kbd>M</kbd> <kbd>Y</kbd>: **convert** a cell to a **code cell**.
- <kbd>Ctrl</kbd> + <kbd>M</kbd> <kbd>M</kbd>: **convert** a cell to a **text cell**.
- <kbd>Ctrl</kbd> + <kbd>M</kbd> <kbd>D</kbd>: **delete** current cell / selected cells.
- <kbd>Ctrl</kbd> + <kbd>M</kbd> <kbd>A</kbd>: **insert** a code cell **above**.
- <kbd>Ctrl</kbd> + <kbd>M</kbd> <kbd>B</kbd>: **insert** a code cell **below**.
- <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>M</kbd>: insert a **comment**.
- <kbd>Ctrl</kbd> + <kbd>Space</kbd> or <kbd>Tab</kbd>: **autocomplete**.
- <kbd>Ctrl</kbd> + <kbd>H</kbd>: global **find/replace**.
- <kbd>Ctrl</kbd> + <kbd>G</kbd>: global **find next**.

{:alert.alert-success}
We can use system commands in Colab with `!<command>`. For example, `!git clone ...`.

## Import libraries

~~~ bash
!pip install -q matplotlib-venn
# or
!apt-get -qq install -y libfluidsynth1
~~~

## Upgrade/Switch TensorFlow versions

~~~ bash
# To determine which version you're using:
!pip show tensorflow
~~~

~~~ bash
# For the current version:
!pip install --upgrade tensorflow
~~~

~~~ bash
# For a specific version:
!pip install tensorflow==1.2
~~~

~~~ bash
# For the latest nightly build:
!pip install tf-nightly
~~~

## Git with Colab

Check out [my note for Git](/git).

~~~ python
# Initialize the git repository (optional)
!git init
~~~

~~~ bash
# Set the global username and email
!git config --global user.email "youremail@domain.com"
!git config --global user.name "Your Name"
~~~

~~~ bash
# Add all the files
!git add -A
# or
!git add .
~~~

~~~ bash
# Commit
!git commit -m "Comment for that commit"
~~~

~~~ bash
# Pass your Github credentials
!git remote rm origin # in the case you meet "fatal: remote origin already exists"
!git remote add origin https://<github-username>:<github-password>@github.com/<github-username>/<repository-name>.git
~~~

~~~ bash
# Push to origin
!git push -u origin master
~~~

If you don't want to use your username andd password, you can use "Personal access tokens" on Github. Create one [here](https://github.com/settings/tokens) and then use,

~~~ python
!git git remote add origin https://<username>:<access-token>@github.com/<username>/<repo>.git
~~~

## Keep Colab awake

<kbd>F12</kbd> then **Console** and type,

~~~ js
function ClickConnect(){
  console.log("Working");
  document.querySelector("colab-connect-button").shadowRoot.getElementById("connect").click()
}
setInterval(ClickConnect,60000)
~~~

## Change to current working directory

By default, the working directory is `/content/`. One can use below command to change to another place,

~~~ python
%cd /content/data-science-learning
~~~

From that point, we are working on `/content/data-science-learning`.

## Upload a file to Colab{% ref "https://colab.research.google.com/notebooks/io.ipynb#scrollTo=hauvGV4hV-Mh" %}

Each user has a "machine" in `/content/`.

## Install

~~~ bash
sudo apt install screen # ubuntu
~~~

## Basic command lines

<div class="col-2-equal">

~~~ bash
# check screen version
screen -v
~~~

~~~ bash
# start new session (with name)
screen -S <name>
~~~

~~~ bash
# list running sessions
screen -ls
~~~

~~~ bash
# attach to a running session (without name)
screen -x
~~~

~~~ bash
# attach to a running session (with name)
screen -rx <name>
# -x for an interactive (scrolling)
~~~

~~~ bash
# detach a running session
screen -d <name> # or Ctrl + A, D
~~~

``` bash
# kill a session
screen -X -S <name> quit
```
</div>

### Delete sessions

1. Reattach first: `screen -r <name>`
2. <kbd>Ctrl</kbd> + <kbd>A</kbd>, <kbd>K</kbd> then <kbd>Y</kbd>

``` bash
# kill ALL auto-created sesssions
screen -ls | grep pts | cut -d. -f1 | awk '{print $1}' | xargs kill

# kill all detached sessions
screen -ls | grep Detached | cut -d. -f1 | awk '{print $1}' | xargs kill
```

## Create a screen + list of command lines

``` bash
screen -S 'dat' -dm bash -c 'cd /jekyll-site; bundle exec jekyll serve -I; exec sh'
```

## Hotkeys

- Detach: <kbd>Ctrl</kbd> + <kbd>A</kbd>, <kbd>D</kbd>
- Reattach: <kbd>Ctrl</kbd> + <kbd>A</kbd>, <kbd>R</kbd>
- Kill current session: <kbd>Ctrl</kbd> + <kbd>A</kbd>, <kbd>K</kbd> then <kbd>Y</kbd>

## Errors

``` bash
# Cannot make directory '/run/screen': Permission denied
mkdir ~/.screen && chmod 700 ~/.screen
export SCREENDIR=$HOME/.screen
# also add this line to ~/.zshrc or ~/.bashrc
```

## Reference

- [Screen Quick Reference](https://gist.github.com/jctosta/af918e1618682638aa82)



Create a new cell and paste,

~~~ python
from google.colab import files

uploaded = files.upload()

for fn in uploaded.keys():
  print('User uploaded file "{name}" with length {length} bytes'.format(
      name=fn, length=len(uploaded[fn])))
~~~

Run ==2 times== this cell, at the 2nd time, you can choose your file.

### Using Google Drive

Run a cell containing following codes,

~~~ python
from google.colab import drive
drive.mount('/content/drive')
~~~

and then follow the guide on the screen. In order to access to the drive,

~~~ python
with open('/content/drive/My Drive/foo.txt', 'w') as f:
  f.write('Hello Google Drive!')
~~~

### Clone a repo from Github

~~~ python
!git clone https://github.com/dinhanhthi/data-science-learning.git
~~~

The cloned folder are stored in `/content/`. If you wanna `pull` requests, use,

~~~ python
%cd /content/data-science-learning
!git pull
~~~

## PyTorch with GPU

To enable GPU backend for your notebook, go to **Edit** → **Notebook Settings** and set **Hardware accelerator** to **GPU**.{% ref "https://jovianlin.io/pytorch-with-gpu-in-google-colab/" %}


## Install 7zip reader, GraphViz, PyDot, cartopy

~~~ bash
# https://pypi.python.org/pypi/libarchive
!apt-get -qq install -y libarchive-dev && pip install -q -U libarchive
import libarchive
~~~

~~~ bash
# https://pypi.python.org/pypi/pydot
!apt-get -qq install -y graphviz && pip install -q pydot
import pydot
~~~

~~~ bash
!apt-get -qq install python-cartopy python3-cartopy
import cartopy
~~~

## Save as HTML

Jupyter Notebook has an option to 'Download as' HTML (or other) format. Google Colaboratory does not.

1. [Install the nbconvert package](https://nbconvert.readthedocs.io/en/latest/install.html).
2. Save your Colab notebook.
4. In your terminal:

	~~~ bash
	jupyter nbconvert --to <output format> <filename.ipynb>
	# jupyter nbconvert --to html mynotebook.ipynb
	~~~

## Other functions

- Interrupt a long running python process: **Runtime** > **Interrupt execution** (<kbd>Alt</kbd> + <kbd>M</kbd> <kbd>I</kbd>).
- Support Jupyter magic commands, check full list [here](https://nbviewer.jupyter.org/github/ipython/ipython/blob/1.x/examples/notebooks/Cell%20Magics.ipynb).