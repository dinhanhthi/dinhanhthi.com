---
layout: post
title: "SSH"
tags: [Skills]
toc: true
icon: ssh.png
keywords: "ssh command line remove server rsa public key private key"
---


👉 Note: [SSH & Github](/github/#clone-via-git%40-(ssh)).

## How it works?

1. Local creates `public_key` (`id_rsa.pub`) & `private_key` (`id_rsa`).
2. Only `private_key` can understand `public_key`.
3. Remote sends messages encrypted based on `public_key`.
4. Local has to use `private_key` to understand (decrypt) remote's messages.

## Generate a public key

- **Windows**: Using below command, if it asks for a location, indicate `C:\Users\dinha\.ssh\`
- **Linux**: `/home/thi/.ssh/`

   ~~~ bash
   ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
   # without email
   ssh-keygen -t rsa -f ~/.ssh/id_rsa.home
   ~~~

### Multiple ssh keys

1. Create key with different names, e.g. `id_rsa.home`, `id_rsa.work`.
2. Add to `~/.ssh/config`,

   ``` bash
   Host home
   Hostname home.example.com
   IdentityFile ~/.ssh/id_rsa.home
   User <your home acct>
   #
   Host work
   Hostname work.example.com
   IdentityFile ~/.ssh/id_rsa.work
   User <your work acct>
   ```
3. Add to ssh-agent (don't need to retype password again)

   ``` bash
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_rsa.home
   ssh-add ~/.ssh/id_rsa.work
   ```
4. Don't forget to clone you repo with `git` instead of `https`.

### Add public key to remote

Suppose that we wanna connect to a remote host `username@remote.com` from a local machine.

1. On local machine, copy public key at `C:/Users/dinha/.ssh` (Windows) and `~/.ssh` (Linux) (something like `id_rsa.pub`) (copy its content).
2. On remote server (Linux), go to `~/.ssh`, open file **authorized_keys** by `vim authorized_keys`
   1. Be carefull, you can modify the current keys!
   2. Go to the end of this file (by <kbd>W</kbd>)
   3. Press <kbd>I</kbd> to enter to the editing mode, press <kbd>Enter</kbd> for a new line.
   4. Using mouse to copy/paste the key in the 1st step (on your local machine).
   5. Note that, each key stays in a separated line.
   6. <kbd>ESC</kbd> and then type `:wq` to quick and save.
   7. Try to connect again!

## Connecting

~~~ bash
ssh remote_username@remote_host
ssh remote_username@remote_host -p remote_port
~~~

<div class="col-2-equal">

~~~ bash
# CHECK VERSION
ssh -V
~~~

~~~ bash
# DISCONNECT
exit
~~~

~~~ bash
# COPY FILE: LOCAL -> REMOTE
scp local_file user@remote-host:/var/tmp/

# multiple files, using wildcat "\*"
~~~

~~~ bash
# REMOTE -> LOCAL
scp user@remote:/usr/local/bin/add.sh .

# multiple files, using wildcat "\*"
~~~

``` bash
# pass inside the command
sudo apt-get install sshpass
sshpass -p your_password ssh user@hostname
```
</div>

``` bash
# copy with sudo on remote
# 1. copy to a place you have permissions
scp * thi@remote:/home/thi/tmp/
# 2. move to the place you want
ssh thi@remote sudo mv /home/thi/tmp/\* /place/we/want
```

## Command line parameters

~~~ bash
# FOR EXAMPLE
ssh -C # use data compression
~~~

**Usage**: [Access jupyter notebooks from remote server on local machine](/jupyter-notebook#jupyter-notebook-on-remote-server).

Below are some popular commands{% ref "http://linuxcommand.org/lc3_man_pages/ssh1.html" %}:

<div class="col-2-equal">

``` bash
# check the full list
man ssh
```

``` bash
# exit background running
sudo apt install net-tools
netstat -lepunt

# kill a process, e.g. 29231/ssh
kill <pid> # eg. kill 29231
```
</div>

<div class="two-columns-list" markdown="1">

- `-C`: use data compression.
- `-f`: Requests ssh to go to background just before command execution
- `-L`: local port forwarding{% ref "https://help.ubuntu.com/community/SSH/OpenSSH/PortForwarding" %}.
- `-N`: Do not execute a remote command.  This is useful for just forwarding ports
- `-p <port>`: port to connect.
- `-q`: quiet mode.
- `-v`: verbose mode.
- `-X`: running GUI remote app locally.
</div>

## Errors

``` bash
# REMOTE HOST IDENTIFICATION HAS CHANGED
# Offending ECDSA key in /home/thi/.ssh/known_hosts:21

# SOLUTION:
# Open /home/thi/.ssh/known_host and delete line 21
```