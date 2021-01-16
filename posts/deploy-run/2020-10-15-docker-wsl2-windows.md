---
layout: post
title: "WSL 2 on Windows"
tags: [MLOps, Windows, Docker]
toc: true
icon: /img/header/docker.svg
keywords: "wsl wsl2 windows subsystem linux windows terminal zsh oh my szh jekyll ruby bundle vscode"
---

{% assign img-url = '/img/post/deploy/docker' %}

## Installation

👉 Ref: [Main tutorial from Microsoft](https://docs.microsoft.com/en-us/windows/wsl/install-win10).

``` bash
# Eanble Windows Subsystem for Linux
# PowerShell as Admin
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# Enable Virtual Machine Platform (for WSL2)
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# restart required
```

``` bash
# Download and install WSL2 Linux kernel update package for x64 machines
https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi
```

``` bash
# Set WSL2 as default version
# PowerShell as Admin
wsl --set-default-version 2
```

``` bash
# Go to Windows Store
# Choose a Linux Distro and install it

# After installing, run Ubuntu app from Start menu
# Follow the instruction on screen

# Update system
sudo apt update
sudo apt upgrade # be careful, it takes time!

# Install dependencies (it takes time)
sudo apt-get install git-core curl wget fontconfig zlib1g-dev build-essential libssl-dev libreadline-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev libcurl4-openssl-dev software-properties-common libffi-dev
```

👉 Note: [Linux](/linux-tips/)
👉 Note: [Fresh Ubuntu / Pop!_OS Installation](/fresh-installation-ubuntu/)
👉 Note: [Bash](/bash-command-line/)

## Location

- The `C` drive is located in `/mnt/c/`.
- The Download folder is located in `/mnt/c/Users/dinha/Downloads/`.
- Open current folder (in WSL2) with Windows Explorer: `explorer.exe .`.
- If you wanna create a drive (eg. `Z`): click on Linux icon in Explorer > Right click on Ubuntu folder > "Map network drive.."

## Terminal?

I use [cmder](https://cmder.net). Read more in [this note](/terminal#windows).

## Docker + GPU + WSL

1. Make WSL2 recognize GPU on Windows 10 👉 Check [this tut](https://docs.nvidia.com/cuda/wsl-user-guide/index.html) with some remarks:
2. Microsoft's: [Enable TensorFlow with DirectML in WSL 2](https://docs.microsoft.com/en-us/windows/win32/direct3d12/gpu-tensorflow-wsl). __Note that__, you have to use the version of python look like exactly in the guide (mine, it's 3.6), otherwise, it won't work!

``` bash
# check if gpu available with docker on wsl2
docker run --rm -it --gpus=all nvcr.io/nvidia/k8s/cuda-sample:nbody nbody -gpu -benchmark

# should see something like this
> Windowed mode
> Simulation data stored in video memory
> Single precision floating point simulation
> 1 Devices used for simulation
GPU Device 0: "GeForce GTX 1070" with compute capability 6.1

> Compute 6.1 CUDA device: [GeForce GTX 1070]
15360 bodies, total time for 10 iterations: 11.949 ms
= 197.446 billion interactions per second
= 3948.925 single-precision GFLOP/s at 20 flops per interaction
```

👉 Check some tests in [this section](https://docs.nvidia.com/cuda/wsl-user-guide/index.html#running-containers).

{% hsbox "Problems with Windows 10 Insider Preview" %}
- If you meet error "_Your insider preview build settings need attention_", restart many times don't solve the problem. 👉 Go to Account setting, then choose "Verify".
- If you cannot install Windows 10 Insider Preview in any case, just abandon, wait for some next regular update and try again. It work for me with no reason!
{% endhsbox %}

## Jekyll on WSL2

__Remark__: We should clone a new version from Github to the local (inside wsl) machine.

``` bash
sudo apt-get install -y ruby-full build-essential zlib1g-dev
which ruby

# Make sure we don't use gem on Windows system
which gem # /usr/bin/ruby

source ~/.zshrc
# restart Windows Terminal

sudo gem install bundler

# cd to jekyll theme folder
bundle install

# continue as usual
bundle exec jekyll build # 1st time after installing
bundle exec jekyll serve
bundle exec jekyll serve -I
```

``` bash
# Troubleshoot: Could not find a JavaScript runtime
sudo apt-get install libv8-dev
bundle update
# install nodejs
curl -sL https://deb.nodesource.com/setup_14.x | bash -
sudo apt-get install -y nodejs
```

``` bash
# Troubleshoot: wsl2 jekyll auto generation windows
# Clone a repo to wsl local, not clone by git on Windows!
```

### VSCode + WSL2 + jekyll

1. Install extension [Remote-WSL](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl)
2. Connect via Debian instead! (`><SWL: Debian`)

## WSL with cmder

**Settings** > **Startup** > **Tasks** > **+**

``` bash
# for debian
set PATH="%ConEmuBaseDirShort%\wsl";%PATH% & wsl -d debian
# for ubuntu
set PATH="%ConEmuBaseDirShort%\wsl";%PATH% & wsl -d ubuntu
```

Choose font _Cascadia Code_ in General > Fonts.
