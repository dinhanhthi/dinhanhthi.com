---
layout: post
title: "Bash command lines"
categories: [skills]
icon-photo: terminal.svg
tags: ['terminal']
keywords: "cmder cmd terminal powershell macos mac linux ubuntu windows vim editor ssh connection download wget check ip permission administrator block compress file zip rar unzip RAM CPU printenv environmental variables alias quick command quick shortcut multiple commands and script bash file ssh commands"
---

{% include toc.html %}

Bash commands are mainly supported in MacOS, Linux but also support in Windows. You can use integrated tools for using bash on these platforms.

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

Run at once,

~~~ bash
command_1 && command_2
~~~

Using script: create a script, e.g. `multiple_commands.sh`, and run `sh multiple_commands.sh`

~~~ bash
#!/bin/sh
echo 'some info'
command_1
command_2
~~~

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

~~~ bash
# MEM USAGE
free -m
~~~

~~~ bash
# ALL ENV
printenv
~~~
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

~~~ bash
# CHECK IP
ifconfig
ipconfig # windows
~~~

~~~ bash
# INTERNET SPEED (need python)
curl -s https://raw.githubusercontent.com/sivel/speedtest-cli/master/speedtest.py | python -
~~~

~~~ bash
# DOWNLOAD A FILE
wget https://website.com/filename.ext
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
</div>

~~~ bash
# ADD A LINE TO A FILE WITHOUT OPENNING IT
echo "hello 'thi' world" >> my_file.txt
~~~

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

# LIST OF ALIASES
alias
~~~
</div>

- **Linux** / **MacOS**: Add your alias to `.bash_aliases` (in home dir, `printenv HOME`) if you wanna store your alias permanently.
- **Windows**: Using [cmder](https://cmder.net/) (its [setting file](/files/cmderSetting.xml)), add more aliases to `<cmder-install>/config/user_aliases.cmd`. You can also add (automatically) on the cmder UI, it adds them for you to the `.cmd` file.

  <div class="hide-show-box">
  <button type="button" markdown="1" class="btn collapsed box-button" data-toggle="collapse" data-target="#box1ct">
  My personal aliases
  </button>
  <div id="box1ct" markdown="1" class="collapse multi-collapse box-content">
  ~~~ bash
  raimon=ssh -p 15424 thi@185.163.221.115
  sshnotebook=ssh -N -L localhost:8765:192.168.0.155:9889 thi@185.163.221.115 -p 15424
  dat=cd dinhanhthi.com
  nt2=cd notetheme2
  serve=bundle exec jekyll serve -I
  build=bundle exec jekyll build
  condafix=set CONDA_DLL_SEARCH_MODIFICATION_ENABLE=1
  playground=cd C:\Users\dinha\Documents\GitHub\dataswati\git\playground
  aquassay=cd C:\Users\dinha\Documents\GitHub\dataswati\git\aquassay
  bronze-alu=cd C:\Users\dinha\Documents\GitHub\dataswati\git\bronze-alu
  soufflet=cd C:\Users\dinha\Documents\GitHub\dataswati\git\soufflet
  popai=cd C:\Users\dinha\Documents\GitHub\dataswati\python-dataswati\popai
  ~~~
  </div>
  </div>


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

## Vim

## SSH

### Commands

~~~ bash
ssh remote_username@remote_host
ssh remote_username@remote_host -p remote_port
~~~

<div class="flex-auto-equal-2" markdown="1">
~~~ bash
# CHECK VERSION
ssh -V

# DISCONNECT
exit
~~~

~~~ bash
# COPY FILE: LOCAL -> REMOTE
scp local_file user@remote-host:/var/tmp/

# REMOTE -> LOCAL
scp user@remote-host:/usr/local/bin/add.sh .
~~~
</div>

### How it works?

1. Local creates `public_key` (`id_rsa.pub`) & `private_key` (`id_rsa`).
2. Only `private_key` can understand `public_key`.
3. Remote sends messages encrypted based on `public_key`.
4. Local has to use `private_key` to understand (decrypt) remote's messages.

### SSH command lines

~~~ bash
# FOR EXAMPLE
ssh -C # use data compression
~~~

**Usage**: [Access jupyter notebooks from remote server on local machine](/jupyter-notebook#jupyter-notebook-on-remote-server).

Below are some popular commands{% ref https://www.ssh.com/ssh/command#ssh-command-line-options %}:

<div class="two-columns-list" markdown="1">
- `-C`: use data compression.
- `-p <port>`: port to connect.
- `-q`: quiet mode.
- `-v`: verbose mode.
- `-X`: running GUI remote app locally.
- `-L`: local port forwarding{% ref https://help.ubuntu.com/community/SSH/OpenSSH/PortForwarding %}.
</div>