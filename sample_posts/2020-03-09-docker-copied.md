---
layout: post
title: "Docker 101"
tags: [MLOps, Docker]
toc: true
icon: /img_src/header/docker.svg
keywords: "pybash tania rascia CI CD continuous integration deployment pipeline docker idea how to use airflow kubernetes k8s k apache container images dangling images vscode vsc visual studio code ssh container env environnement file variable"
---

{% assign img-url = '/img/post/deploy/docker' %}

👉 Note: [ Docker  + GPUs](/docker-gpu)
👉 Note: [ Wordpress Docker](/wordpress-docker)
👉 Note: [ Airflow + Kubernetes 101](/airflow-k8s-101)
👉 Note: [ Tensorflow extra](/tensorflow)

## What and Why?

{% hsbox "Intuitive images" %}

![What's docker]({{img-url}}/docker.png){:.img-80}
_Souce [rollout.io](https://rollout.io/blog/is-docker-secure/)._

![Container  vs Virtual Machine]({{img-url}}/vm-vs-docker.png){:.img-100}
_Container  vs Virtual Machine, souce [docker.com](https://www.docker.com/resources/what-container)._

![RAM usage: Docker  vs Virtual Machine]({{img-url}}/ram_docker_vm.jpg){:.img-80}
_RAM usage: Docker  vs Virtual Machine, souce [eureka.com](https://www.edureka.co/blog/what-is-docker-container)._

{% endhsbox %}

## Abbreviate

<div class="two-columns-list">

- `ps` = process status : check running containers (with `-a` for all)
- `-i` = interactive : used in `docker exec` or `docker run`
- `-t` = terminal : used in `docker exec` or `docker run`
- `-m` = memory
- `-v` or `--volume` : corresponding folders in/out containers.
- `--rm` : create temprarily a container (removed after exit)
</div>

## Installation

For all platforms, check [this](https://docs.docker.com/get-docker/).

### Linux

{:.noindent}
- For Linux, check [this](https://docs.docker.com/engine/install/)!

	::: hsbox Show codes
    ``` bash
    # uninstall old versions
    sudo apt-get remove docker docker-engine docker.io containerd runc
    sudo apt-get update
    sudo apt-get install \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg-agent \
        software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

    # make sure: 9DC8 5822 9FC7 DD38 854A  E2D8 8D81 803C 0EBF CD88
    sudo apt-key fingerprint 0EBFCD88
    sudo add-apt-repository \
      "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) \
      stable"

    # install docker engine
    sudo apt-get update
    sudo apt-get install docker-ce docker-ce-cli containerd.io

    # check if everything is ok
    sudo docker run hello-world

	# incase docker-compose isn't installed
	sudo apt install docker-compose
    ```
    :::

	If you use Ubuntu 20.04+, replace `$(lsb_release -cs)` with `eoan` because docker currently (17 May 20) doesn't support 20.04 yet!

- If wanna run docker without `root`, check [this](https://docs.docker.com/engine/install/linux-postinstall/).

  ``` bash
  sudo groupadd docker # create a docker group
  sudo usermod -aG docker <user> # add <user> to group
  newgrp docker # activate the changes
  ```
- Configure docker start on boot (Ubuntu 15.04 or later)

  ``` bash
  sudo systemctl enable docker
  ```

### MacOS

👉 Check [this](https://docs.docker.com/docker-for-mac/install/).

### Windows

👉 Note: [Docker + WSL2](/docker-wsl2-windows/#docker-%2B-gpu-%2B-wsl)

{% hsbox "Check the requirements" %}
You must have Windows 10: Pro, Enterprise, or Education (Build 15063 or later). Check [other requirements](https://docs.docker.com/docker-for-windows/install/#what-to-know-before-you-install).

~~~ bash
# POWERSHELL
# check window version
Get-WmiObject -Class Win32_OperatingSystem | % Caption
# check window build number
Get-WmiObject -Class Win32_OperatingSystem | % Buildnumber
~~~

Active **Hyper-V** and **Containers** (you can do it manually in **Turn Windows features on or off**)

~~~ bash
# Open PowerShell with Administrator and run following
Enable-WindowsOptionalFeature -Online -FeatureName containers –All
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V –All
# restart
~~~
{% endhsbox %}

1. [Download](https://docs.docker.com/docker-for-windows/install/) and install.
2. Check `docker version`.
3. Try `docker run hello-world`.

### With GPUs support?

Check [this note](/docker-gpu).

## Uninstall

### Linux

``` bash
# from docker official
sudo apt-get remove docker docker-engine docker.io containerd runc
```

``` bash
# identify what installed package you have
dpkg -l | grep -i docker

# uninstall
sudo apt-get purge -y docker-engine docker docker.io docker-ce docker-ce-cli
sudo apt-get autoremove -y --purge docker-engine docker docker.io docker-ce
```

``` bash
# remove images containers
sudo rm -rf /var/lib/docker /etc/docker
sudo rm /etc/apparmor.d/docker
sudo groupdel docker
sudo rm -rf /var/run/docker.sock
```

## Login & Download images

``` bash
docker login
# using username (not email) and password
```

{:.noindent}
- Download at [Docker Hub](https://hub.docker.com/).
- Download images are store at `C:\ProgramData\DockerDesktop\vm-data` (Windows) by default.

## Check info

``` bash
# docker's version
docker --version
```

### Images


<div class="col-2-equal">

``` bash
# list images on the host
docker images
```

``` bash
# check image's info
docker inspec <image_id>
```
</div>

### Containers

<div class="col-2-equal">

~~~ bash
# list running containers
docker ps
docker ps -a # all (including stopped)
~~~

~~~ bash
# only the ids
docker ps -q
docker ps -a -q
~~~

``` bash
# container's size
docker ps -s
docker ps -a -s
```

``` bash {% raw %}
# container's names only
docker ps --format '{{.Names}}'
docker ps -a --format '{{.Names}}'
{% endraw %}```

``` bash {% raw %}
# Check the last command in container
docker ps --format '{{.Command}}' --no-trunc
{% endraw %}```

``` bash
# check log
# useful if we wanna see the last running tasks's
docker container logs <container_name>
```

``` bash
# get ip address
docker inspect <container_name> | grep IPAddress
```

``` bash
# Enter currently running container
docker attach <container_name>
```
</div>

### Others

<div class="col-2-equal">

``` bash
# RAM & CPU usages
docker stats
docker stats <container_name>
```
</div>

## Attach / Start / Stop

We can use sometimes interchangeable between `<container_id>` and `<container_name>`.

<div class="col-2-equal">

~~~ bash
# get info (container's id, image's id first)
docker ps -a
~~~

~~~ bash
# start a stopped container
docker start <container_id>

# start and enter the container
docker start -i <container>
~~~

~~~ bash
# stop a container
docker stop <container_id>
~~~

~~~ bash
# going to running container env
docker exec -it <container_name> bash
~~~

``` bash
# stop all running containers
docker stop $(docker ps -a -q)
```
</div>

## Delete

Read more [here](https://www.digitalocean.com/community/tutorials/how-to-remove-docker-images-containers-and-volumes).

### Everything
<div class="col-2-equal">

~~~ bash
# any resources
docker system prune
~~~

~~~ bash
# with all unused images
docker system prune -a
~~~
</div>

### Images

<div class="col-2-equal">

~~~ bash
# list all images
docker images -a
~~~

~~~ bash
# remove a specific image
docker image rm <IMAGE_ID>
~~~
</div>

**Dangling images** are layers that have no relationship to any tagged images.

<div class="col-2-equal">

~~~ bash
# list dangling images
docker images -f dangling=true
~~~

~~~ bash
# remove dangling images
docker images purge
~~~
</div>

### Containers

<div class="col-2-equal">

``` bash
# remove a specific containers
docker rm -f <container-id>
```

``` bash
# remove all containers
docker rm -f $(docker ps -a -q)
```
</div>

## Build an image

### Create

<div class="col-2-equal">

~~~ bash
# build image with Dockerfile
docker build -t <img_name> .

# custom Dockerfile.abc
docker build -t <img_name> . -f Dockerfile.abc
~~~

~~~ bash
# with docker-compose
docker-compose up
# with custom file
docker-compose -f docker-compose.amin.yml up -d
~~~

~~~ bash
# if success
# service name "docker_thi"
docker run -it <service_name> bash
~~~

``` bash
# from current container
docker ps -a # check all containers
docker commit <container_id> <new_image_name>
```
</div>
