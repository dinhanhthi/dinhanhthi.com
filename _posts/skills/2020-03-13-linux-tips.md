---
layout: post
title: "Linux notes"
categories: [skills]
tags: [bash, linux]
icon-photo: linux.svg
keywords: "find with command line in linux ubuntu elementary os distro distribution move files to trash wrong owner gnome screen shot windows shrink partition resize disk drive turn off animation minimize gnome tweak tool vietnam vietnamese input method vn ime F2 kill process .bin .run install bookmark evince pdf reader PPA does not have Release file ip address ipconfig nautilus window explorer file manager shortcut hotkey thumbnail shorten directory terminal open as admin remove delete files folders folder size mount iso virtual disk extract iso file sync files mega megatools vim quit vim download upload $PATH path copy files from ubuntu to iOS check current path rename files folders surface book linux-surface errors problem bluetooth failed to load module user group ownership add user permission matlab graphic ui drive connector install silently remove matlab uninstall matlab download from google drive ssh control access another computer remote control server machine download playlist youtube youtube-dl mp3 tag mogrify wget ppa remove dconf guake free vpn vpnbook openvpn"
---

{% include toc.html %}

Quick tips / references for using Linux / **Ubuntu**.

👉 [Fresh installation Ubuntu note.](/fresh-installation-ubuntu) <br />
👉 [Bash](/bash-command-line)

## General

🔅 Run MacOS apps on Linux, use [Darling](https://darlinghq.org/).

🔅 Run Android apps on Linux, use [Anbox](https://anbox.io/).

🔅 Find in linux with command lines ⇾ [link](https://chrisjean.com/4-great-tools-to-find-files-quickly-in-ubuntu/)

🔅 Cannot move files to the trash/wrong owner ⇾ [link](https://askubuntu.com/questions/288513/cant-move-files-to-the-trash)

🔅 Gnome screenshot ⇾ [link](https://www.howtoforge.com/tutorial/taking-screenshots-in-linux-using-gnome-screenshot/)

🔅 Windows shrink drive in windows ⇾ [link](https://somoit.net/windows/windows-cannot-shrink-volume-unmovable-files) (partition, resize disk drive, hard disk)

🔅 Type Vietnamese in SublimeText, install `vn ime` (exactly like that). Press <kbd>F2</kbd> for using.

🔅 Look and kill an app process:

~~~ bash
ps ax | grep teamviewer # check the id
kill -9 <pid> # kill some process
~~~

🔅 Install file `.bin`, `.run`

~~~ bash
chmod +x file-name.run
./file-name.run
~~~

🔅 Make a script executable: `chmod a+x script_file`

🔅 Unzip a file,

~~~ bash
sudo apt-get install unzip
unzip <file>
unzip <file> -d <destination>
~~~

🔅 Terminal multi windows:

~~~ bash
sudo apt-get install terminator
~~~

🔅 Add bookmark for evince (default pdf reader)

- <kbd>F9</kbd>: hide/show sidebar
- Menu on the top right > Add bookmarks
- Click on bookmark and rename it
- <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd> to save (instead of <kbd>Ctrl</kbd> + <kbd>S</kbd>)

🔅 Remove PPA from ubuntu by terminal. For example, _The repository 'http://ppa.launchpad.net/b-eltzner/qpdfview/ubuntu artful Release' does not have a Release file._ Remove the file _b-eltzner-qpdfview-ubuntu_ from directory _/etc/apt/sources.list.d_

~~~ bash
sudo rm /etc/apt/sources.list.d/<file>
~~~

Or using below command lines

``` bash
# install
sudo add-apt-repository ppa:name

# remove
sudo add-apt-repository --remove ppa:name
```

🔅 Get ip address: `ifconfig`

## Settings

🔅 Make Monday as the start of the week:

``` bash
sudo -H gedit /usr/share/i18n/locales/en_GB
# change to 1
first_weekday 1
# save and restart the system
```

🔅 Add / Remove / Manage app icon in launcher: `sudo apt-get install alacarte`.

🔅 Change ubuntu logo in settings: replace

``` bash
/usr/share/icons/hicolor/256x256/apps/ubuntu-logo-icon.png
```

🔅 Turn off animation open and minimize windows on ubuntu 17.10 and later (gnome desktop): *Gnome Tweak Tools > Apperance > Animations OFF*

🔅 Choose between "lightdm" and "gdm3" ([ref](https://wiki.debian.org/LightDM)):

``` bash
sudo apt install lightdm
dpkg-reconfigure lightdm
# current config
lightdm --show-config
```

🔅 Save / Load dconf ({% ref https://bgstack15.wordpress.com/2017/10/04/dconf-save-and-load-from-file/ %}): `~/.config/dconf/user`

``` bash
# save guake configs to a file
dconf dump / > dconf-settings.ini

# load
dconf load / < dconf-settings.ini
# or
cat dconf-settings.ini | dconf load /
```

🔅 Save / load custom keyboard shortcuts ([ref](https://askubuntu.com/questions/682513/how-to-backup-restore-system-custom-keyboard-shortcuts))

``` bash
# keybindings
dconf dump /org/gnome/desktop/wm/keybindings/ > keybindings.dconf
# media keys
dconf dump /org/gnome/settings-daemon/plugins/media-keys/ > media-keys.dconf

# load
dconf load /org/gnome/desktop/wm/keybindings/ < keybindings.dconf
dconf load /org/gnome/settings-daemon/plugins/media-keys/ < keybindings.dconf
```

## Applications

🔅 Completely remove LibreOffice,

``` bash
# zsh uses \*
sudo apt-get remove --purge libreoffice*
sudo apt-get clean
sudo apt-get autoremove
```

🔅 Remove snap store

``` bash
sudo apt autoremove --purge snapd
```

🔅 Uninstall snap applications

``` bash
sudo snap remove <app_name>
```

🔅 Convert office's files to pdf

``` bash
# install first
sudo apt install libreoffice
# pptx -> pdf
soffice --headless --convert-to pdf prezentacja.pptx
```

## Nautilus / Files management

🔅 Force Unity Dash to index all files on Home

``` bash
sudo updatedb
```

🔅 Sync one folder to another ([more info](https://unix.stackexchange.com/questions/203846/how-to-sync-two-folders-with-command-line-tools))

``` bash
# A -> B/A
rsync -avu --delete "/home/user/A" "/home/user/B"

# A/* -> B/A
rsync -avu --delete "/home/user/A/" "/home/user/B/A"

# A, C -> B/A, B/C
rsync -avu --delete "/home/user/A" "/home/user/C" "/home/user/B"
```

- `-a` Do the sync preserving all filesystem attributes
- `-v` run verbosely
- `-u` only copy files with a newer modification time (or size difference if the times are equal)
- `--delete` delete the files in target folder that do not exist in the source

``` bash
# exclude
rsync -a --exclude 'dir1' src_directory/ dst_directory/
rsync -a --exclude={'file1.txt','dir1/*','dir2'} src_directory/ dst_directory/
```

🔅 Make a shortcut link to a folder/file in linux terminal ⇾ [link](https://unix.stackexchange.com/questions/226315/how-to-use-ln-s-to-create-a-command-line-shortcut)

🔅 Shortcut to a folder in linux ⇾ [link]( https://unix.stackexchange.com/questions/226315/how-to-use-ln-s-to-create-a-command-line-shortcut)

🔅 Thumbnail nautilus: go to setting, set and apply this line

~~~ bash
sudo chown -R yourusername:yourusername ~/.cache/thumbnails
~~~

🔅 Shorten directory in terminal

- Temporarily, just enter `PS1='\u:\W\$ '` en press enter.
- Permanently, open `sudo gedit ~/.bashrc` and find
    ~~~ bash
  if [ "$color_prompt" = yes ]; then
  PS1='${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '
  else
  PS1='${debian_chroot:+($debian_chroot)}\u@\h:\w\$ '
  fi
    ~~~
- Remove `@\h` and replace `\w` by `\W` so that it becomes,
    ~~~ bash
  if [ "$color_prompt" = yes ]; then
  PS1='${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\u\[\033[00m\]:\[\033[01;34m\]\W\[\033[00m\]\$ '
  else
  PS1='${debian_chroot:+($debian_chroot)}\u:\W\$ '
  fi
    ~~~
- Save, exit, close terminal and start another to see the result.

🔅 Right click nautilus "Open as Administrator":

~~~ bash
sudo apt-get install nautilus-admin
nautilus -q # restart nautilus
~~~

🔅 Mount iso file on linux

~~~ bash
sudo mount -o loop <image>.iso /mnt/<folder>
~~~

If you mount another iso file to the same <folder>, it will replace the current one.

🔅 Extract a iso file: first, mount it like in 37 to folder named `iso` then copy all the contents in `iso` to some folder you want.

~~~ bash
cp -r /mnt/iso <directory>
~~~

🔅 Sync files with mega right on terminal

- Install megatools: `sudo apt-get install megatools`
- Using megatools, cf the [main website](https://megatools.megous.com).
- Create a condig file which stores your login information (be careful, everyone can see your pass)
    ~~~ bash
  sudo apt-get install vim # in case that you don't have vim on your system
  vim .megarc # create a file named .megarc
    ~~~
- `vim` opens and type
    ~~~ bash
  [Login]
  Username = your@email
  Password = yourpassword
    ~~~
    If you have back slash in your password, you must escape it with another backslash
- Quit `vim` and save the file by pressing <kbd>ESC</kbd> and then `:wq!`
- Upload a file: `megaput --path /Root/<folder> file`
- See the list of file on remote: `megals`
- Upload a folder: `megacopy --local <folder> --remote <folder>`
- Download from link: `megadl <mega-link>`
- Download a single file: `megaget <file>`
    ~~~ bash
  megaget /Root/Apps/matlab17b/R2017b_glnxa64_dvd2.iso
    ~~~
- Download from uploaded directory:
    ~~~ bash
  megacopy --local <folder> --remote <folder-to-download> --download
    ~~~

🔅 Save a directory a `$PATH` of local profile.

~~~ bash
sudo gedit ~/.profile
# copy and paste following line (should change the path)
export PATH=/home/thi/anaconda3/bin:$PATH
# save and close .profile and then apply following line to get instant update
source ~/.profile
~~~

🔅 Copy files from ubuntu to iPhone iOS iPad

- Don't need to install any files if one needs to copy photos/videos from iphone to ubuntu, one can use gThumb to do this or just use file manager to copy.
- If one wants to copy files to iphone. Follow [this one](https://askubuntu.com/questions/799414/how-to-move-files-from-ubuntu-to-iphone)

🔅 Check the current path: `pwd`

## Surface

🔅 Tweaks for ubuntu on surface book ⇾ [link](https://medium.com/@viettrungdang/tweaks-for-ubuntu-on-surface-book-cd05cdb8f378)

🔅 App [`linux-surface`](https://github.com/jakeday/linux-surface).

## User / Group / Ownership

🔅 How to add existing user to an existing group{% ref https://askubuntu.com/questions/79565/how-to-add-existing-user-to-an-existing-group %}

~~~ bash
sudo usermod -a -G groupName userName
~~~

🔅 Change ownership of a folder and its children

~~~ bash
# folder and its children
chown -R thi:root folder
# a file
chown <user>:<group> file
~~~

🔅 Check the permission of curent directory:

~~~ bash
ls -l
ls -l <file>
~~~

{% hsbox Check this photo %}
{:.img-full-80}
![check ll](/img/post/linux/ll-user.png)
{% endhsbox %}

## Matlab

🔅 Scale matlab: need to install matleb version >= R2017b

~~~ matlab
s = settings;s.matlab.desktop.DisplayScaleFactor
s.matlab.desktop.DisplayScaleFactor.PersonalValue = 2
~~~

🔅 Launching matlab without graphic ui{% ref https://blogs.mathworks.com/community/2010/02/22/launching-matlab-without-the-desktop/ %}

~~~ bash
matlab -nodesktop
~~~

🔅 Cannot open matlab without sudo: change the owner permission of folder */home/thi/.matlab* to thi*

Another solution: suppose that matlab is installed on a user's directory and you have already add this to the `$PATH`. IT's only work if you use `matlab` (not `sudo matlab`). Then do

~~~ bash
sudo env "PATH=$PATH"
~~~

from this, you can `sudo matlab`

🔅 Matlab drive connector: after installing, run

~~~ bash
~/bin/MATLABConnector toggle
~~~

🔅 How to install matlab silently (only with command lines) on linux? (if below doesn't work, you can [check here](http://installfights.blogspot.com/2016/11/how-to-install-matlab-without-gui.html), my method is different from this one)

1. Suppose that you have 2 dvd iso files which contains the installation of matlab (`dvd1.iso` and `dvd2.iso`)
1. For the activation, you have `libmwservices.so` and `license_standalone.lic`
1. First, you need to extract 2 dvd iso files to a common folder named `install_matlab` in `/home/thi/`
1. Create a new folder to install matlab called `matlabR` in `/home/thi/`
1. Extract all files in 2 iso files to folder `install_matlab` like the instruction 38
1. Run below command line
    ~~~ bash
sudo /home/thi/matlab_install/install -agreeToLicense yes -mode silent -destinationFolder /home/thi/matlabR -fileInstallationKey xxxxx-xxxxx-xxxxx  -outputFile /home/matlab_install.log
    ~~~
1. After the installation, copy file `license_standalone.lic` to `/home/thi/matlabR/licenses/`
1. Copy file `libmwservices.so` to `/home/thi/matlabR/bin/glnxa64/`
1. Try running matlab: `/home/thi/matlabR/bin/matlab`
1. If you have an error like `libXt.so.6: cannot open shared object file: No such file or directory`, try to install
    ~~~ bash
sudo apt-get install libxt6
    ~~~
1. Make linux recognize your matlab command `matlab` like in the instruction 40.

🔅 Make linux recognize matlab command

- Suppose that you have installed matlab on `/home/thi/matlabR`
- You need to add above directory to the `$PATH` so that the system can recognize your `matlab` command
    ~~~ bash
  export PATH=$PATH:/home/thi/matlabR/bin
    ~~~
- You can use `echo $PATH` to check if the path is located in it or not.

🔅 Remove matlab on linux: simply `rm -rf <matlab-folder>`

## Network

🔅 Don't show "_Turn on wifi hotspot..._" for clicking => try: click on "Network" and then "Wifi" in Settings.

🔅 Share terminal for other (via SSH): using [Teleconsole](https://www.teleconsole.com/),

``` bash
# install
curl https://www.teleconsole.com/get.sh | sh

# share current terminal
teleconsole

# choose to connect via web browser
# or via terminal
teleconsole join <id>

# stop broadcasting
exit

# port forwarding
# suppose that a port is open at 3000 on your machine and you
# wanna share it with your friend
teleconsole -f localhost:3000
```

🔅 Download a direct link by terminal

~~~ bash
wget <direct-link> -O <name-of-file>.<file-extension>
~~~

🔅 Download from google drive by terminal

- Download as usual without terminal by a web browser
- Open Downloads windows of the browser and then copy the download link.
- Stop the download process
- Use the command link in 33 where `<direct-link>` is the link copied above.

🔅 Use `ssh` to get access to another computer in the same network (LAN)

0. Follow (a little bit) [here](https://www.makeuseof.com/tag/remotely-manage-linux-server-ssh/).
1. On the remote machine
    1. update and upgrade install
    2. install `openssh-server`
    3. open `/etc/ssh/sshd_config` and uncomment on `Port 22` and lines starting with `Hostkey...`
    4. start the network: `sudo service ssh start`
    5. stop the network: `sudo service ssh stop`
    6. check if the network is running or not? `sudo service ssh status`
    7. Check the current ip: `ifconfig`: look on the _inet_
7. On the local machine
    8. Install the same tool and use `ssh username@remote-host`

🔅 Connect `ssh` to a virtual machine (the same network)

- Install openssh for both client and server machine
    ~~~ bash
  sudo apt-get install openssh-client
  sudo apt-get install openssh-server
    ~~~
- On server machine, check ssh is running or not
    ~~~ bash
  ps -A | grep sshd
  # return [number] ?  00:00:00 sshd then it works
    ~~~

🔅 Download playlist audio youtube, using [`youtube-dl`](https://github.com/rg3/youtube-dl/blob/master/README.md#readme)

~~~ bash
sudo apt-get install curl -y (cài curl nếu chưa cài)
sudo curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl
sudo chmod a+rx /usr/local/bin/youtube-dl

# update 11/11/20: not working with playlist but single song!
youtube-dl --extract-audio --audio-format mp3 -o "%(title)s.%(ext)s" <link-playlist>
~~~

### Free VPN

Using [vpnbook](https://www.vpnbook.com/) and [its tutorial](https://www.vpnbook.com/howto/setup-openvpn-on-ubuntu). Note that, at the last step, we need to run with `sudo`! __Note__: very low speed!

## Media / Photo / Music

🔅 Add shortcut keys for Rhythmbox Music Player -> read [this](https://askubuntu.com/questions/181651/how-to-assign-hot-keys-to-control-rhythmbox).

1. Enable plugin "MPRIS D-Bus interface".
2. Add custom shortcuts keyboards as
  - Play/Pause: `rhythmbox-client --play-pause`
  - Next: `rhythmbox-client --next`
  - Previous: `rhythmbox-client --previous`

🔅 Convert `.ts` videos to `.mp4`

``` bash
sudo apt install ffmpeg
ffmpeg -i input.ts -c:v libx264 -c:a aac output.mp4
```

🔅 Mp3 tag editor:

~~~ bash
sudo apt install exfalso  # Ex Falso
~~~

🔅 Spotify controller shortcut keyboards on Ubuntu ([ref](https://askubuntu.com/questions/1105363/spotify-keyboard-controls-not-working)): using below commands for controlling playbacks in spotify, put them in a shortcut keys on ubuntu:

``` bash
# play/puase
dbus-send --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.mpris.MediaPlayer2.Player.PlayPause

# next track
dbus-send --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.mpris.MediaPlayer2.Player.Next

# previous track
dbus-send --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.mpris.MediaPlayer2.Player.Previous
```

🔅 Resize multiple photos (keep the ratio/scale) ([more options](https://imagemagick.org/Usage/resize/)):

🔅 __Youtube Music Controller for Linux__:

1. Download and install [this app](https://github.com/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-).
2. Change to Youtube Music interface.
3. Remove all shortcut keyboards that look like the ones you wanna set in the app in Ubuntu system (__Keyboard shortcuts__).
4. On taskbar, right click on the You Tube Music app > Desktop settings > Hotkeys > Set your keyboards (eg. `Ctrl+Shift+>` for next track, `Ctrl+Shift+<` for previous track, `Ctrl+Shift+Space` for play/pause track).

<div class="flex-50" markdown="1">
~~~ bash
# install
sudo apt-get install imagemagick
~~~

~~~ bash
# resize but keep the ratio (save to jpg)
mogrify -resize 50% -format jpg *
~~~

~~~ bash
# resize keep the extension
mogrify -resize 50% *
~~~

~~~ bash
# with a specific size (save to jpg)
mogrify -resize 800x600 -format jpg *
~~~

~~~ bash
# just the width (save to jpg)
mogrify -resize 800x -format jpg *
~~~

~~~ bash
# only resize images bigger than 1000px width
mogrify -resize 1000x\> *
~~~
</div>

## Game

🔅 Game platforms: Steam, [Lutris](https://lutris.net/).

🔅 Xbox Controller on Ubuntu:

``` bash
# for bluetooth recognize
sudo apt-get install xboxdrv

# for GUI testing app
sudo apt-get install jstest-gtk
```

## System

🔅 System monitor in terminal: [vtop](https://github.com/MrRio/vtop)

``` bash
sudo apt install nodejs
sudo apt install npm
sudo npm install -g vtop
```

## Errors

🔅 Problem save file as `root` user and cannot open later ⇾ [link](https://askubuntu.com/questions/817902/unable-to-open-any-graphical-app-with-sudo/817906#817906)

🔅 Prevent bluetooth devices disconnected after sleep ⇾ [link](https://unix.stackexchange.com/questions/177998/bluetooth-mouse-disconnects)

🔅  _Failed to load module 'canberra-gtk-module_

~~~ bash
sudo apt install libcanberra-gtk-module libcanberra-gtk3-module
~~~

🔅 _nvidia docker signatures invalid. The following signatures were invalid: EXPKEYSIG_

``` bash
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
```

🔅 _bash: warning: setlocale: LC_ALL: cannot change locale (en_US.UTF-8)_

``` bash
echo "LC_ALL=en_US.UTF-8" >> /etc/environment
echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen
echo "LANG=en_US.UTF-8" > /etc/locale.conf
locale-gen en_US.UTF-8
```

🔅 _dpkg: error processing package install-info_

``` bash
sudo mv /var/lib/dpkg/info/install-info.postinst /var/lib/dpkg/info/install-info.postinst.bad
```

🔅 _APT had planned for dpkg to do more than it reported back_

``` bash
dpkg --configure -a
apt-get install -f
```

### GPU-NVDIA problems

🔅 Problems with pytorch versions: [check this](/pytorch#errors).

🔅 _RuntimeError: cuda runtime error (804) : forward compatibility was attempted on non supported HW at /pytorch/aten/src/THC/THCGeneral.cpp:47_ (after update system including nvdia-cli, maybe) => The same problem with below, need to restart the computer.

🔅 `nvidia-smi`: _Failed to initialize NVML: Driver/library version mismatch_.

- [This thread](https://stackoverflow.com/questions/43022843/nvidia-nvml-driver-library-version-mismatch): just restart the computer.