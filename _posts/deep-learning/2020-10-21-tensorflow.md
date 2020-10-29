---
layout: post
title: "Tensorflow extra"
categories: [deep learning]
tags: [tensorflow, docker, gpu]
icon-photo: tensorflow.svg
notfull: 1
keywords: device gpu cuda nvidia graphical device torch deep learning neural network dell xps 7590 gpu install nvidia installation torch docker nvidia-docker nvidia-container-runtime packages
---

{% include toc.html %}

## Check if GPU available?

``` python
# check if GPU available?
import tensorflow as tf
tf.config.list_physical_devices('GPU')
```

## Installation with docker

👉 [Official guide](https://www.tensorflow.org/install/docker). <br />
👉 [Docker & GPU note](/docker-gpu).

The advantage of this method is that you <mark>only have to install GPU driver on the host machine</mark>.

{% hsbox Note about docker version %}

Check docker version: `docker --version`:

- `<19.03`: requires [`nvidia-docker2`](/docker-gpu#install-nvidia-docker2) (check by `nvidia-docker version`) and `--runtime=nvidia`.
- `>=19.03`: requires `nvidia-container-toolkit` (check by `which nvidia-container-toolkit`) and `--gpus all`.
{% endhsbox %}

### Without docker-compose

👉 [Different types of images for tensorflow](https://www.tensorflow.org/install/docker#download_a_tensorflow_docker_image).

``` bash
# pull the image
docker pull tensorflow/tensorflow:latest-gpu-jupyter

# run a container
mkdir ~/Downloads/test/notebooks
docker run --name docker_thi_test -it --rm -v $(realpath ~/Downloads/test/notebooks):/tf/notebooks -p 8888:8888 tensorflow/tensorflow:latest-gpu-jupyter
```

``` bash
# check if gpu available?
nvidia-smi

# check if tf2 working?
docker exec -it docker_thi_test bash
python
```

``` python
import tensorflow as tf
tf.config.list_physical_devices('GPU')
```

### With docker-compose?

👉 Read [this note](/docker-gpu#using-docker-compose) instead.

### On Windows WSL2

## Install directly on Linux (without docker)

On my computer, [Dell XPS 15 7590](https://www.dell.com/fr-fr/work/shop/laptops/15-7590/spd/xps-15-7590-laptop) - NVIDIA® GeForce® GTX 1650 Mobile.

{:.alert.alert-danger}
This section is not complete, the guide is still not working!

### Installation

👉 [GPU support : TensorFlow](https://www.tensorflow.org/install/gpu)

This guide is specific for:

``` bash
pip show tensorflow # 2.3.1
pip show tensorflow-gpu # 2.3.1
nvidia-smi # NVIDIA-SMI 450.80.02 Driver Version: 450.80.02 CUDA Version: 11.0
```

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