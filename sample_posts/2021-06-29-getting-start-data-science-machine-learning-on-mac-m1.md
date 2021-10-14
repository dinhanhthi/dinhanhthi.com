---
layout: post
title: "DS & ML with Mac M1"
tags: [MLOps, Data Science, Machine Learning, Deep Learning]
toc: true
icon: macos_ml.png
notfull: 1
keywords: "data science machine learning tensorflow deep learning mac m1 macos apple getting start installation python pip package docker images"
---

This is my personal list of to-do things for a new Macbook.

👉 Note: [Mac fresh start](/fresh-install-macos/).
👉 Note: [Python installation](/python-installation/).
👉 Note: [Docker 101](/docker/).

👉 [My dockerfiles](https://github.com/dinhanhthi/my-dockerfiles/tree/master/docker-ai) on Github.

## Install

``` bash
# Install XCode (from Appstore)

# Install XCode Command Line Tolls
xcode-select --install

# Download & install miniforge3
# https://github.com/conda-forge/miniforge
# (Choose "MacOSX-arm64" version)

chmod +x ~/Downloads/Miniforge3-MacOSX-arm64.sh
sh ~/Downloads/Miniforge3-MacOSX-arm64.sh
source ~/miniforge3/bin/activate

# Restart terminal and check
which python
# /Users/thi/miniforge3/bin/python
which pip
# /Users/thi/miniforge3/bin/pip
```

``` bash
# Init conda with zsh?
conda init zsh
source ~/.zshrc
```

``` bash
# Create virtual env
conda create -n ds-tf2.5 python=3.9.5
conda activate ds-tf2.5

# Install Tensorflow dependencies
conda install -c apple tensorflow-deps

# Install base tensorflow
python -m pip install tensorflow-macos

# Install metal plugin
python -m pip install tensorflow-metal
```

``` bash
# Install needed packages
conda install --file requirements.txt

# single package
conda install -y scikit-learn
# check after installing
pip show scikit-learn
```

👉🏻 [Install scikit-learn on M1](https://scikit-learn.org/stable/install.html#installing-on-apple-silicon-m1-hardware) (official note).
👉🏻 Note: [Python installation](/python-installation/).

## Testing

``` bash
python

# In python environement
import tensorflow as tf
print(tf.__version__)
```

``` bash
# Jupyter Notebook
jupyter lab
```

## References

- **Apple Developer** -- [Getting Started with tensorflow-metal PluggableDevice](https://developer.apple.com/metal/tensorflow-plugin/).
- **MakeOptim** -- [AI - Apple Silicon Mac M1 natively supports TensorFlow 2.5 GPU acceleration (tensorflow-metal PluggableDevice)](https://makeoptim.com/en/deep-learning/tensorflow-metal).