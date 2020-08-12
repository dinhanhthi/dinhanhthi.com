---
layout: post
title: "Fresh Ubuntu Installation"
categories: [others]
tags: [bash, linux, collection, fresh install]
icon-photo: ubuntu.svg
keywords: "to do list after installing ubuntu debian elementary os linux airpod bluetooth capture screen screen recorder guake"
---

The basic steps I often do every time I install a new Ubuntu system. The order of things is important.

👉 [Linux note.](/linux-tips) <br />
👉 [Windows fresh start](/fresh-install-windows) <br />
👉 [Mac fresh start](/fresh-install-macos)


1. Download [Ubuntu ISO](https://ubuntu.com/download/desktop). If you like a MacOS-like version, you can choose [Elementary OS](https://elementary.io/).
2. Using [Rufus](https://rufus.ie/) to create a bootable USB drives.
3. Download and install [Google Chrome](https://www.google.com/chrome). Install also these extensions: [mate translate](https://chrome.google.com/webstore/detail/mate-translate-%E2%80%93-translat/ihmgiclibbndffejedjimfjmfoabpcke), [google dictionary](https://chrome.google.com/webstore/detail/google-dictionary-by-goog/mgijmajocgfcbeboacabfgobmjgjcoja), [TabCloud](https://chrome.google.com/webstore/detail/tabcloud/npecfdijgoblfcgagoijgmgejmcpnhof), [raindrop](https://chrome.google.com/webstore/detail/raindropio/ldgfbffkinooeloadekpmfoklnobpien), [last pass](https://chrome.google.com/webstore/detail/lastpass-free-password-ma/hdokiejnpimakedhajhdlcegeplioahd), [AVIM](https://chrome.google.com/webstore/detail/avim-vietnamese-input-met/opgbbffpdglhkpglnlkiclakjlpiedoh), [adblock](https://chrome.google.com/webstore/detail/adblock-%E2%80%94-best-ad-blocker/gighmmpiobklfepjocnamgkkbiglidom), [GNOME Shell integration](https://chrome.google.com/webstore/detail/gnome-shell-integration/gphhapmejobijbbhgpjhcjognlahblep).
4. Make emojis showing up
~~~ bash
sudo apt install fonts-noto-color-emoji
~~~
    After that (make browser regonize more icons), create a new file
    ``` bash
    ~/.config/fontconfig/conf.d/01-emoji.conf
    ```
    with [this content](https://github.com/dinhanhthi/scripts/blob/master/settings/ubuntu/01-emoji.conf).
1. Install [Guake Terminal](/terminal#guake-terminal) (drop-down terminal supporting tabs). We install it first because we working mainly on terminal.
2. Install Terminator (can split, in appstore)
3. Update & Upgrade
~~~ bash
sudo apt update & sudo apt upgrade
~~~
1. Change user avatar.
4. Auto install drivers
~~~ bash
sudo ubuntu-drivers autoinstall
~~~
In case you wanna switch between Intel (more power efficient) and NVDIA driver (more powerful)
~~~ bash
sudo prime-select intel
sudo prime-select nvidia
~~~
5. Check the NVDIA driver and install the newest version: check in **Additional Drivers**. In case you wanna remove it and reinstall it later, use
~~~ bash
sudo apt purge nvidia-*
~~~
6. Install video codecs,
~~~ bash
sudo apt install ubuntu-restricted-extras
~~~
1. Log in to online accounts: Google, Ubuntu One, StackOverflow, Notion, Trello, Facebook,...
2. Download and install an email client, I use [Mailspring](https://getmailspring.com/). Log in to email accounts and let Mailspring downloads the necessary things.
3. Install **GoldenDict** (app store) and [dictionaries](https://drive.google.com/open?id=1jna8_grA-wyhPrq8BiB7ypadvW3tTlIv).
4. Python is installed on Ubuntu system with 2 versions. By default, `python` prefers version 2, if you wanna use python 3, you can use `python3` or add an alias
~~~ bash
alias python='python3' # and call python 2 as `python2`
~~~
Install PIP
~~~ bash
pip sudo apt install python3-pip
alias pip=pip3
~~~
5. [Visual Studio Code](https://code.visualstudio.com/) and its basic extensions: Bracket Pair Colorizer, Docker, Linux Themes for VS Code, Markdown All in One, Markdown Shortcuts, Remote Development, Python, Auto Close Tags

    Also add below settings to setting json file (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> and search "Preferences: Open Settings (JSON)", it's in `~/.config/Code/User`)
6. Install GIT
~~~ bash
sudo apt install git-all
~~~
1. Install Git Client as [Gitkraken](https://www.gitkraken.com/). Log in with Github account and clone [all working repositories](https://github.com/dinhanhthi?tab=repositories).
2. [Slack](https://slack.com/intl/en-fr/downloads/linux) and sign in.
3. Install GNOME Shell extensions
~~~ bash
sudo apt install gnome-shell-extensions
~~~
    Install also [chrome extension](https://extensions.gnome.org/). Go to the corresponding extension link and turn it on and install it. List of useful extensions: [Start Overlay in Application View](https://extensions.gnome.org/extension/1198/start-overlay-in-application-view/), [ESC to close overview from applications list](https://extensions.gnome.org/extension/1122/esc-to-close-overview-from-applications-list/), [Caffein](https://extensions.gnome.org/extension/517/caffeine/), [Dash to Panel](https://extensions.gnome.org/extension/1160/dash-to-panel/) (use [this setting file](/files/ubuntu/dash_to_panel_setting)), [Alt-Tab Switcher Popup Delay Removal](https://extensions.gnome.org/extension/1317/alt-tab-switcher-popup-delay-removal/), [Sound Input & Output Device Chooser](https://extensions.gnome.org/extension/906/sound-output-device-chooser/), [gtile](https://extensions.gnome.org/extension/28/gtile/), [icon-hider](https://extensions.gnome.org/extension/351/icon-hider/) (on gnome taskbar), [Emoji selector](https://extensions.gnome.org/extension/1162/emoji-selector/).
1. Turn off Gnome Shell Activities Animations (click on window taskbar to toggle max/min),
``` bash
gsettings set org.gnome.desktop.interface enable-animations true # enable
gsettings set org.gnome.desktop.interface enable-animations false # disable
```
2. [Microsoft Teams](https://teams.microsoft.com/).
3. [IBUS Bamboo](https://github.com/BambooEngine/ibus-bamboo), Vietnamese Input Method. Need to restart Ibus and choose Bamboo in the keyboard layout. You can use also <kbd>Shift</kbd> + <kbd>~</kbd> for changing the options (remove the underline, for example). Use <kbd>Super</kbd> + <kbd>Space</kbd> to change between input methods.
4. Make things in **GNOME Tweak** tool. Using [this setting file](https://github.com/dinhanhthi/scripts/blob/master/settings/ubuntu/dconf-settings.ini).

    ``` bash
    # save settings
    dconf dump /home/thi/ > dconf-settings.ini

    # load settings
    dconf load /home/thi/ < dconf-settings.ini
    ```
5. Google Drive client for Ubuntu: [OverGrive](https://www.thefanclub.co.za/overgrive) (5\$ for each account). An alternative to [Vgrive](https://github.com/bcedu/VGrive).
6. LaTeX
~~~ bash
sudo apt-get install texlive-full # 5GB
sudo apt-get install texmaker
~~~
5. If you install Matlab, you can install `matlab-support` to add matlab icon to applications. Note that, if matlab exe file is at `/usr/local/MATLAB/R2017b/bin/matlab`, we add the location of folder as `/usr/local/MATLAB/R2017b/`.
6. Use <kbd>super</kbd> + <kbd>E</kbd> to open File Manager: change in Keyboard shortcut.
7. Default text editor `gedit`, you can use this command in terminal.
8. **Gnome Calendar** in app store.
9. Screen Recorder, use **Kazam** (app store). If cannot recognize mic and speaker, read [this solution](https://askubuntu.com/questions/1234314/screen-recording-applications-are-not-detecting-audio-in-ubuntu-20-04). An alternative is [SimpleScreenRecorder](https://www.maartenbaert.be/simplescreenrecorder/).
10. VLC (app store).
11. Read SD card
~~~ bash
sudo apt-get install exfat-utils exfat-fuse
~~~
13. If you wanna create some app shortcut in launcher (`/home/thi/.local/share/applications/notion.desktop`)
``` bash
#!/usr/bin/env xdg-open
[Desktop Entry]
Version=1.0
Type=Application
Terminal=false
Exec=/home/thi/apps/notion/notion
Name=Notion
Comment=Notion
Icon=/home/thi/apps/notion/resources/app/icon.png
```
1. If you wanna make nautilus default again:
``` bash
xdg-mime default nautilus.desktop inode/directory application/x-gnome-saved-search
gsettings set org.gnome.desktop.background show-desktop-icons true
```
2. If you wanna make some web app a desktop app, use [nativefier](github.com/jiahaog/nativefier).
3. Bluetooth problem on Dell XPS 15 only: cannot turn on bluetooth ⇒ Try turn off and turn on again the bluetooth in BIOS setting.
4. Useful shortcuts:
   - Capture fullscreen: `Ctrl+Alt+Print` (photos will be saved in **Pictures**)
1. Connect Airpod to Ubuntu 20.04:

    ``` bash
    # check bluetooth service is running
    hciconfig -a

    # open a file
    sudo nano /etc/bluetooth/main.conf

    # add
    ControllerMode = bredr

    # restart bluetooth service
    sudo /etc/init.d/bluetooth restart

    # disconnect other headphone device
    # press and hold backward button in the airpod case (flash light)
    # connect to airpod as other device via bluetooth
    ```
1. Location of `.desktop` files,

    ``` bash
    /home/thi/.local/share/applications/
    /usr/share/applications/
    /var/lib/snapd/desktop/applications/
    # or
    locate *.desktop # bash
    locate \*.desktop # zsh
    ```
2. Xbox controller bluetooth connection: check [this](https://askubuntu.com/questions/998144/how-can-i-use-my-xbox-one-s-controller-via-bluetooth).
3. Remove icon from dash application

    ``` bash
    sudo add-apt-repository ppa:caldas-lopes/ppa
    sudo apt-get update
    sudo apt-get install ezame
    ```
1. Restore [dconf settings](https://github.com/dinhanhthi/scripts/blob/master/settings/ubuntu/user_dconf): copy to `~/.config/dconf/user`.
2. Disable touchpad automatically when plugging mouse:

    ``` bash
    sudo add-apt-repository ppa:atareao/atareao
    sudo apt update
    sudo apt install touchpad-indicator
    # then open > click on icon > preferences > action tab > "Disable touchpad when mouse plugged"
    ```
3.  Other applicatons: [Skype](https://www.skype.com/en/get-skype/), [Extreme Download Manager](https://subhra74.github.io/xdm/), [AO](https://klaussinani.tech/ao/) (MS to do for Ubuntu), **Shotwell** (image viewer + quick editor, install on Store), **KolourPaint** (photo editor supports cut and move a selection like Paint on Windows, install from AppStore), **Cheese** (camera app), [Drawing](https://maoschanz.github.io/drawing/), [Stacer](https://oguzhaninan.github.io/) (optimizer system like Advanced System Care).
4.  <mark>Backup before installing a new system.</mark>
    - settings in `~/.config/` or `~/.<software-name>`
    - all apps in `/home/thi/apps/` with their desktop files in `/home/thi/.local/share/applications/`