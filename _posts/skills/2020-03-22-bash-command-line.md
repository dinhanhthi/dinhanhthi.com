---
layout: post
title: "Bash command lines"
categories: [skills]
icon-photo: terminal.svg
keywords: "cmder cmd terminal powershell macos mac linux ubuntu windows vim editor"
---

{% include toc.html %}

Bash commands are mainly supported in MacOS, Linux but also support in Windows. You can use integrated tools for using bash on these platforms.

## Tools

- **Apps**: [cmder](https://cmder.net/) (Windows), [iTerm2](https://www.iterm2.com/) (MacOS), [Guake Terminal](http://guake-project.org/) (Linux).
- **Online**: [repl.it](https://repl.it/languages/bash)

## Check info

### System

<div class="flex-auto-equal-2" markdown="1">
~~~ bash
# DISK SPACE
df -h
~~~

~~~ bash
# CPU & RAM
cat /proc/cpuinfo
cat /proc/meminfo
~~~
</div>

### Folders / Files

<div class="flex-auto-equal-2" markdown="1">
~~~ bash
# FOLDER SIZE
du -hs <directory>
# `h` : human readable (6.7G)
# `s` : only this directory
~~~

~~~ bash
# CHECK PERMISSION
ls -l 
ls -l <file>
~~~

~~~ bash
# ADD existing USER to existing GROUP
sudo usermod -a -G groupName userName
~~~

~~~ bash
# CHANGE PERMISSION
chown <user>:<group> file
chown -R thi:root folder # folder & children
~~~

~~~ bash
# CURRENT PATH
pwd
~~~

~~~ bash
# RENAME a file/folder
mv olname.txt newname.txt
~~~

~~~ bash
# REMOVING
rm <file>
rm -f <file> # force to remove
rm -rf <dir> # remove folder and files included
rmdir <empty-dir> # remove empty directories
~~~
</div>

### Network

~~~ bash
# CHECK IP
ifconfig
ipconfig # windows
~~~

## Copy / Cut / Paste

## Vim