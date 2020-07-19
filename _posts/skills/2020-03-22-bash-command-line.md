---
layout: post
title: "Bash command lines"
categories: [skills]
icon-photo: terminal.svg
tags: ['bash']
keywords: "cmder cmd terminal powershell macos mac linux ubuntu windows vim editor download wget check ip permission administrator block compress file zip rar unzip RAM CPU printenv environmental variables alias quick command quick shortcut multiple commands and script bash print print tree folder files structure windows terminal"
---

{% include toc.html %}

Bash commands are mainly supported in MacOS, Linux but also support in Windows. You can use integrated tools for using bash on these platforms.

👉 Terminals: check [this note](/terminal).

## Tools

- **Apps**: [cmder](https://cmder.net/) (Windows), [iTerm2](https://www.iterm2.com/) (MacOS), [Guake Terminal](http://guake-project.org/) (Linux).
- **Online**: [repl.it](https://repl.it/languages/bash)

## Hotkeys

- <kbd>Ctrl</kbd> + <kbd>C</kbd> : interrupt current tasks.
- <kbd>Ctrl</kbd> + <kbd>L</kbd> : clear the screen.
- <kbd>Tab</kbd> : autocomplete the commands / directories / file names / ....
- <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>V</kbd> : paste from clipboard.
- For a long list: <kbd>Enter</kbd> to continue to read, <kbd>q</kbd> to quit.

## Multiple commands

<div class="flex-50" markdown="1">
~~~ bash
# run at once
command_1 && command_2
~~~

``` bash
# using script: file .sh
#!/bin/sh
echo 'some info'
command_1
command_2
```
</div>

## Commands with parameters



## Search

<div class="flex-50" markdown='1'>
``` bash
# all files / folders containing 'abc'
ls | grep -i abc
```

``` bash
# find command lines containing 'abc'
dpkg -l | grep -i abc
```
</div>

## Check info

### System

<div class="flex-auto-equal-2" markdown="1">
~~~ bash
# DISK SPACE
df -h
~~~

~~~ bash
# CPU
cat /proc/cpuinfo | grep 'model name' | uniq # model
cat /proc/cpuinfo | grep 'vendor' | uniq # vendor
cat /proc/cpuinfo | grep processor | wc -l # number of processes
~~~

~~~ bash
# MEM USAGE
free -m
~~~

~~~ bash
# ALL ENV
printenv
~~~

``` bash
# NVIDIA
nvidia-smi
lspci -nn | grep '\[03' # another way
```
</div>

### Folders / Files

<div class="flex-auto-equal-2" markdown="1">
~~~ bash
# CHANGE ACTIVE DIR
cd <dir>
cd # to the startup dir
cd / # to root
cd .. # to father dir
~~~

~~~ bash
# CREATE NEW FOLDER
mkdir <dir>
~~~

~~~ bash
# LIST
ls
ls -a # including hidden
ls | grep 'ubuntu' # files containing 'ubuntu' in name
~~~

~~~ bash
# CURRENT PATH
pwd
~~~

~~~ bash
# FOLDER/FILE SIZE
du -hs <directory / file>
# `h` : human readable (6.7G)
# `s` : only this directory
~~~

~~~ bash
# REMOVING
rm <file>
rm -f <file> # force to remove
rm -rf <dir> # remove folder
rmdir <empty-dir> # remove empty
~~~

~~~ bash
# COMPRESS
zip file.zip file/folder
unzip file.zip # decompress
~~~

~~~ bash
# PRINT TREE folder structure
tree
tree -d # only folders
~~~
</div>

### Permission

<div class="flex-auto-equal-2" markdown="1">
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
</div>

### Network

<div class="flex-50" markdown='1'>
~~~ bash
# CHECK IP
ifconfig
ipconfig # windows
~~~

~~~ bash
# DOWNLOAD A FILE
wget https://website.com/filename.ext
~~~
</div>

~~~ bash
# INTERNET SPEED (need python)
curl -s https://raw.githubusercontent.com/sivel/speedtest-cli/master/speedtest.py | python -
~~~

### Text file

<div class="flex-auto-equal-2" markdown="1">
~~~ bash
# QUICK LOOK CONTENT
more file.txt
cat file.txt
~~~

~~~ bash
# JUST CREATE
touch file.txt
~~~

~~~ bash
# CREATE + MODIFY
nano file.txt # Ctrl+X to quit
vim file.txt # ESC, :q to quit
~~~

~~~ bash
# SEARCH STRING
grep "string" file.txt
~~~

~~~ bash
# ADD A LINE TO A FILE WITHOUT OPENNING IT
echo "hello 'thi' world" >> my_file.txt
~~~
</div>

## Alias

Create your own "alias" command for short,

<div class="flex-auto-equal-2" markdown="1">
~~~ bash
# CREATE
alias yourAlias='cd /usr/'
alias yourAlias=cd /usr/ # windows
~~~

~~~ bash
# CALL
yourAlias
~~~

~~~ bash
# LIST OF ALIASES
alias
alias abc # "abs" stands for what?
~~~

``` bash
# remove an alias
unalias abc
```
</div>

- **Linux** / **MacOS**: Add your alias to `.bash_aliases` (in home dir, `printenv HOME`) if you wanna store your alias permanently.
- **Windows**: Using [cmder](https://cmder.net/) (its [setting file](/files/cmderSetting.xml)), add more aliases to `<cmder-install>/config/user_aliases.cmd`. You can also add (automatically) on the cmder UI, it adds them for you to the `.cmd` file.


## Copy / Cut / Paste

<div class="flex-auto-equal-2" markdown="1">
~~~ bash
# MOVE
mv <old-dir> <new-dir>
move <old-dir> <new-dir> # windows
~~~

~~~ bash
# RENAME a file/folder
mv olname.txt newname.txt
~~~

~~~ bash
# COPY
cp file file
cp -r file&dir file&dir
~~~
</div>