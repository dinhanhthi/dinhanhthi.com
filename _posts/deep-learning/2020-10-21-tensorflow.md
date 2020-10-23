---
layout: post
title: "Tensorflow extra"
categories: [deep learning]
icon-photo: tensorflow.svg
notfull: 1
keywords: device gpu cuda nvidia graphical device torch deep learning neural network dell xps 7590 gpu install nvidia installation torch
---

{% include toc.html %}

## Using docker

### On Linux

### On Windows WSL2

## Install directly on Linux (without docker)

On my computer, [Dell XPS 15 7590](https://www.dell.com/fr-fr/work/shop/laptops/15-7590/spd/xps-15-7590-laptop) - NVIDIA® GeForce® GTX 1650.

### Check if GPU available?

``` python
# check if GPU available?
import tensorflow as tf
tf.config.list_physical_devices('GPU')
```

### Installation

``` bash
# First, install drivers and check
nvidia-smi
# result: NVIDIA-SMI 450.80.02    Driver Version: 450.80.02    CUDA Version: 11.0
```

### Errors?

``` bash
# Could not load dynamic library 'libcudart.so.10.1'; dlerror: libcudart.so.10.1: cannot open shared object file: No such file or directory
```

Need to install new **cuda** & **CUDNN libraries** and **tensorflow**. (This note is for `tensorflow==2.3.1` and [`CUDA 11.1`](https://developer.nvidia.com/cuda-downloads?target_os=Linux&target_arch=x86_64&target_distro=Ubuntu&target_version=2004&target_type=deblocal)). {% ref https://medium.com/@cwbernards/tensorflow-2-3-on-ubuntu-20-04-lts-with-cuda-11-0-and-cudnn-8-0-fb136a829e7f %}

``` bash
# update path
export PATH=/usr/local/cuda-11.1/bin${PATH:+:${PATH}}
export LD_LIBRARY_PATH=/usr/local/cuda-11.1/lib\
                         ${LD_LIBRARY_PATH:+:${LD_LIBRARY_PATH}}

# quickly test cuda version
nvcc --version
```