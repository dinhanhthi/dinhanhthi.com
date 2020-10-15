---
layout: post
title: "Docker: install docker WSL2 + Windows"
categories: [deploy & run]
tags: [bash, linux, docker, "deploy & run"]
icon-photo: docker.svg
keywords: "wsl wsl2 windows subsystem linux"
---

{% assign img-url = '/img/post/deploy/docker' %}

{% include toc.html %}

## WSL on Windows

👉 [Main tutorial](https://docs.microsoft.com/en-us/windows/wsl/install-win10).

``` bash
# Eanble Windows Subsystem for Linux
# PowerShell as Admin
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# Enable Virtual Machine Platform (for WSL2)
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```