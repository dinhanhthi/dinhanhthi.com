---
layout: post
title: "Tensorflow discrete note"
tags: [Deep Learning]
toc: true
icon: tensorflow.svg
notfull: true
keywords: "device gpu cuda nvidia graphical device torch deep learning neural network dell xps 7590 gpu install nvidia installation torch docker nvidia-docker nvidia-container-runtime packages batch size problem"
---

## GPU?

::: col-2-equal
``` python
# check if GPU available?
import tensorflow as tf
tf.config.list_physical_devices('GPU')
```

``` python
# prevent tf uses gpu
# add below before any tf import
import os
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
```
:::

## Installation with docker

👉 [Official guide](https://www.tensorflow.org/install/docker).
👉 Note: [Docker & GPU](/docker-gpu/).

The advantage of this method is that you <mark>only have to install GPU driver on the host machine</mark>.

::: hsbox Note about docker version
Check docker version: `docker --version`:

- `<19.03`: requires [`nvidia-docker2`](/docker-gpu#install-nvidia-docker2) (check by `nvidia-docker version`) and `--runtime=nvidia`.
- `>=19.03`: requires `nvidia-container-toolkit` (check by `which nvidia-container-toolkit`) and `--gpus all`.
:::

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

👉 Read [this note](/docker-gpu#using-docker-compose%3F) instead.

### On Windows WSL2

## Install directly on Linux (without docker)

On my computer, [Dell XPS 15 7590](https://www.dell.com/fr-fr/work/shop/laptops/15-7590/spd/xps-15-7590-laptop) - NVIDIA® GeForce® GTX 1650 Mobile.

::: danger
This section is not complete, the guide is still not working!
:::

### Installation

👉 [GPU support : TensorFlow](https://www.tensorflow.org/install/gpu)

This guide is specific for:

``` bash
pip show tensorflow # 2.3.1
pip show tensorflow-gpu # 2.3.1
nvidia-smi # NVIDIA-SMI 450.80.02 Driver Version: 450.80.02 CUDA Version: 11.0
```

👉 Note: [PyTorch](/pytorch#installation/).
👉 Note: [Ubuntu](/fresh-installation-ubuntu/).
👉 Note: [Linux](/linux-tips#gpu-nvdia-problems/).

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

Need to install new **cuda** & **CUDNN libraries** and **tensorflow**. (This note is for `tensorflow==2.3.1` and [`CUDA 11.1`](https://developer.nvidia.com/cuda-downloads?target_os=Linux&target_arch=x86_64&target_distro=Ubuntu&target_version=2004&target_type=deblocal)). {% ref "https://medium.com/@cwbernards/tensorflow-2-3-on-ubuntu-20-04-lts-with-cuda-11-0-and-cudnn-8-0-fb136a829e7f" %}

``` bash
# update path
export PATH=/usr/local/cuda-11.1/bin${PATH:+:${PATH}}
export LD_LIBRARY_PATH=/usr/local/cuda-11.1/lib\
                         ${LD_LIBRARY_PATH:+:${LD_LIBRARY_PATH}}

# quickly test cuda version
nvcc --version
```

---

``` bash
# WARNING:tensorflow:Your input ran out of data; interrupting training. Make sure that your dataset or generator can generate at least `steps_per_epoch * epochs` batches (in this case, 2000 batches). You may need to use the repeat() function when building your dataset.
```

Problem come from you don't have enough images!

``` python
train_generator = train_datagen.flow_from_directory(batch_size = 20)
validation_generator =  test_datagen.flow_from_directory(batch_size  = 20)

# Found 1027 images belonging to 2 classes.
# Found 256 images belonging to 2 classes.

model.fit(
    validation_data = validation_generator,
    steps_per_epoch = 100,
    epochs = 20,
    validation_steps = 50,
    verbose = 2)
```

We must have `steps_per_epoch * batch_size <= #of images`, in this case `100*20 = 2000 > 1027`. Check [this answer](https://github.com/fizyr/keras-retinanet/issues/1449#issuecomment-691867911) for more information.

``` python
# correct
model.fit(
    ...
    steps_per_epoch = 50, # batches in the generator are 20, so it takes 1027//20 batches to get to 1027 images
    ...
    validation_steps = 12, # batches in the generator are 20, so it takes 256//20 batches to get to 256 images
    ...)
```

---

``` bash
# Not found: No algorithm worked!

# OR
# This is probably because cuDNN failed to initialize
```

``` bash
nvidia-smi
# check and kill the process that uses GPU much
# restart the task
```

``` python
# OR: add the following to your code
from tensorflow.compat.v1 import ConfigProto
from tensorflow.compat.v1 import InteractiveSession

config = ConfigProto()
config.gpu_options.allow_growth = True
session = InteractiveSession(config=config)
```