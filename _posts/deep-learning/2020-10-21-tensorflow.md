---
layout: post
title: "Tensorflow extra"
categories: [deep learning]
icon-photo: tensorflow.svg
notfull: 1
keywords: device gpu cuda nvidia graphical device torch deep learning neural network dell xps 7590 gpu install nvidia installation torch docker nvidia-docker nvidia-container-runtime packages
---

{% include toc.html %}

## Using docker

The advantage of this method is that you only have to install GPU driver on the host machine.



### On Linux

### On Windows WSL2

## Install directly on Linux (without docker)

On my computer, [Dell XPS 15 7590](https://www.dell.com/fr-fr/work/shop/laptops/15-7590/spd/xps-15-7590-laptop) - NVIDIA® GeForce® GTX 1650 Mobile.

### Check if GPU available?

``` python
# check if GPU available?
import tensorflow as tf
tf.config.list_physical_devices('GPU')
```

### Installation

👉 [GPU support  |  TensorFlow](https://www.tensorflow.org/install/gpu)

Specific for:

1. Tensorflow 2.3.1
2. Tensorflow-gpu 2.3.1
3. nvidia-driver-440 (installed in _Additional Drivers_)
4. NVIDIA-SMI 450.80.02
5. CUDA version 11.0

👉 [PyTorch note](/pytorch#installation). <br />
👉 [Ubuntu note](/fresh-installation-ubuntu). <br />
👉 [Linux note](/linux-tips#gpu-nvdia-problems).

_CUDA Toolkit_:

- If you meet _Existing package manager installation of the driver found_, try [this method](https://askubuntu.com/questions/1211919/error-installing-cuda-toolkit-existing-package-manager-installation-of-the-driv) to remove some already-installed packages before continuing.
- Or you can download cuda toolkit `.run` and then run

``` bash
sudo sh cuda_11.1.0_*.run --toolkit --silent --override
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