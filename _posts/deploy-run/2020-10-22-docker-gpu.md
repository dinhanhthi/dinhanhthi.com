---
layout: post
title: "Docker + GPUs"
categories: [deploy & run]
tags: [bash, ide, linux, docker, "deploy & run"]
icon-photo: docker.svg
notfull: 1
keywords: "pybash tania rascia CI CD continuous integration deployment pipeline docker idea how to use airflow kubernetes k8s k apache container images dangling images vscode vsc visual studio code ssh container env environnement file variable nvidia docker runtime gpus tensorflow torch"
---

{% assign img-url = '/img/post/deploy/docker' %}

{% include toc.html %}

👉 [Docker note](/docker).

## With Tensorflow or Torch

👉 [Docker : TensorFlow](https://www.tensorflow.org/install/docker)

## Check info

``` bash
# verify that your computer has a graphic card
lspci -nn | grep '\[03'
```

``` bash
# First, install drivers and check
nvidia-smi
# output: NVIDIA-SMI 450.80.02 Driver Version: 450.80.02    CUDA Version: 11.0
# it's maximum CUDA version that your driver supports
```

``` bash
# install and check nvidia-docker
dpkg -l | grep nvidia-docker
# or
nvidia-docker version
```

``` bash
# Verifying –gpus option under docker run
docker run --help | grep -i gpus
# output: --gpus gpu-request GPU devices to add to the container ('all' to pass all GPUs)
```

``` bash
# Listing out GPU devices
docker run -it --rm --gpus all ubuntu nvidia-smi -L
# output: GPU 0: GeForce GTX 1650 (...)
```

``` bash
# Verifying again with nvidia-smi
docker run -it --rm --gpus all ubuntu nvidia-smi
```

``` bash
# test a working setup container-toolkit
sudo docker run --rm --gpus all nvidia/cuda:11.0-base nvidia-smi
```

## Diff: toolkit vs runtime

👉 [What's the difference between the lastest nvidia-docker and nvidia container runtime？ · Issue #1268 · NVIDIA/nvidia-docker](https://github.com/NVIDIA/nvidia-docker/issues/1268)

> In this note, with Docker 19.03+ (`docker --version`), he says that `nvidia-container-toolkit` is used for `--gpus` (in `docker run ...`), `nvidia-container-runtime` is used for `--runtime=nvidia` (can also be used in `docker-compose` file).

> However, if you want to use Kubernetes with Docker 19.03, you actually need to continue using nvidia-docker2 because Kubernetes doesn't support passing GPU information down to docker through the --gpus flag yet. It still relies on the nvidia-container-runtime to pass GPU information down the stack via a set of environment variables.

👉 [Installation Guide — NVIDIA Cloud Native Technologies documentation](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html#docker)