---
layout: post
title: "Fresh MacOS installation"
tags: [Others, Fresh Installation, MacOS]
toc: true
icon: macos.svg
keywords: "install new macbook setting up applications command line zsh terminal nodejs python brew shortcut cask nodejs node zsh oh-my-zsh"
---

This is my personal list of to-do things for a new Macbook.

👉 Note: [Ubuntu / Pop!_OS fresh start](/fresh-installation-ubuntu).
👉 Note: [Windows fresh start](/fresh-install-windows).

## Basic controls

This is not the first things to do!

### Keyboards

{% hsbox "Finder" %}
1. Delete: [[⌘]] + [[⌫]]
2. Show hidden files/folders: [[⇧]] + [[⌘]] + [[.]]
3. Move: [[⌘]] +n [[C]] (Copy) > [[⌘]] + [[⌥]] + [[V]] (Paste as moving).
4. [[↩]] to rename a folder/file.
{% endhsbox %}


{% hsbox "Terminal" %}
1. [[⌃]] + [[L]] : clear screen (use [[⌃]] as [[Ctrl]] key on Windows/Linux system!).
{% endhsbox %}


{% hsbox "Chrome" %}
1. Focus to the adress bar: [[⌘]] + [[L]]
2. History: [[⌘]] + [[Y]]
{% endhsbox %}


{% hsbox "Capture Screen" %}
1. All screen + saved to clipboard: [[⌃]] + [[⌘]] + [[⇧]] + [[3]]
2. All screen + saved to file: [[⌘]] + [[⇧]] + [[3]]
3. Selected area + saved to clipboard: [[⌘]] + [[⇧]] + [[4]]
4.  Selected area + saved to file: [[⌃]] + [[⌘]] + [[⇧]] + [[4]]
5.  Screenshot + recording option: [[⌘]] + [[⇧]] + [[5]]
6.  Screenshot + recording option: [[⌘]] + [[⇧]] + [[5]]
{% endhsbox %}


{% hsbox "Others" %}
- **Lock screen**: [[⌃]] + [[⌘]] + [[Q]]
- Hide window app on dock: [[⌥]] + click or [[⌘]] + [[H]]
- Emoji: [[⌘]] + [[⌃]] + [[␣]]
- Normal delete key: [[⌃]] + [[D]].
{% endhsbox %}

### Trackpad

{% hsbox "1 finger" %}
1. Tap to click.
{% endhsbox %}


{% hsbox "2 fingers" %}
1. Swipe up/down to scroll.
2. Single tap to right click.
3. Swipe left/right to switch between pages.
4. Swipe from right edge to open notification section.
5. Double tap to smart zoom.
{% endhsbox %}


{% hsbox "3 fingers" %}
1. Touch and move left/right to drag the content of texts.
2. Tap to search for definition of selected text.
{% endhsbox %}


{% hsbox "4 fingers" %}
1.  Swipe between opening fullscreen apps.
2.  Swipe up to show all opening windows.
3.  Swipe down to show all opening windows of current applications (app expose).
{% endhsbox %}


{% hsbox "All fingers" %}
1.  Pinch to open launchpad.
2.  Spread to show desktop.
{% endhsbox %}


## Keyboard & Trackpad settings

Go to **Keyboard Settings** and then,

🔅 Choosen the language and input source:  **Input Sources**.

1. Should choose "U.S." instead of "U.S. International" because with the latter, we have underline score below special symbols like `"`
2. For Vietnamese input method, DON'T choose built-in VNese input options. Use [GoTiengViet](https://www.trankynam.com/gotv/) instead! (Because there will be unconfortable underline when we type if we)

🔅 Disbale auto correcting words when typing in **Text**. Untick all first 3 boxes!

🔅 Add more dictation (speed to text) languages: Vietnamese and French, choose VNese as default language.

🔅 **Keyboard**:

1.  Touch Bar shows: **F1, F2, etc Keys**.
2.  Press ... to: **Do Nothing**.
3.  Press and hold ... to: **Show Control Srip**.
4.  Tick on "Use F1, F2..."
5.  Click on **Customize Control Strip** and change. Below are my customization.

	``` bash
	Brightness - Keyboard Brightness -- Media -- Volume -- Screen Lock -- Night Shift -- Screen Capture -- Dictation -- Siri
	```

🔅 Map top-left keyboard to backslash/tilde symbols. Install [Karabiner-Elements](https://karabiner-elements.pqrs.org/) and setting up "non_us_backslash" to "grave_accent_and_tilde (`)". If you don't know the names of some keys, you can use installed Karabiner Viewer.

🔅 **System Preferences** > **Trackpad**: Choose all for all.

🔅 3 fingers to drag (choose texts): **System Preferences** > **Accessibility** > **Pointer Control** > **Trackpad Options...** > Enable dragging (three fingers drag).

🔅 Install [alt-tab](https://alt-tab-macos.netlify.app/) (and use [[⌘]] + [[⇥]] which replaces the default method on mac, be careful!!!) to switch between windows (instead of apps) like on Windows/Linux: `brew install --cask alt-tab`

## Installation unknown softwares

🔅 Sometimes, you cannot install some app from the internet, just go to **System Preferences** > **Security & Privacy** > There will be some warning line at below of "App Store and identified developers", just click "Open anyway"!

🔅 If you have some issue with `.dmg` file like "resource busy", open **Disk Utility**, then **Images** > **Verify...** > Choose the image file you cannot open then click "Verify"!

## Git & Dev

🔅 Install [git](/git/) (may be prompted automatically by the system to install it) and **setting up git**. Below are short things,

::: hsbox Codes
``` bash
eval "$(ssh-agent -s)"
ssh-add -l # list current keys

# create ssh keys
ssh-keygen -t rsa -b 4096 -C "dinhanhthi@gmail.com" # /Users/thi/.ssh/id_rsa.thi
ssh-add /Users/thi/.ssh/id_rsa.thi

ssh-keygen -t rsa -b 4096 -C "thi@ideta.io" # /Users/thi/.ssh/id_rsa.ideta
ssh-add /Users/thi/.ssh/id_rsa.ideta

# list the current keys again
ssh-add -l

# Add public keys to Github or something else!
```
:::

🔅 Clone repositories to `/Users/thi/git/`.

🔅 Install NodeJS, consider to install [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) before. **Remark** (2/2021), currently only v15 works native on Apple M1 chip.

🔅 Install [Hombrew](https://brew.sh/) (missing package control for mac).

``` bash
# after install, don't forget to add to PATH
echo 'eval $(/opt/homebrew/bin/brew shellenv)' >> /Users/thi/.zprofile
eval $(/opt/homebrew/bin/brew shellenv) # refresh

# problem with "old" cask
# instead of
brew cask something
# use
brew install --cask something
```

🔅 Install Miniconda (python): download [bash version](https://docs.conda.io/en/latest/miniconda.html) and then

``` bash
bash <downloaded file>
# remember to run conda init after being asked
```

## Printers & Scanners

🔅 Setting up **printers** (if available). You may need [Gutenprint](http://gimp-print.sourceforge.net/MacOSX.php) for an alternative driver for printers on chip M1. After installing the drivers, turn on your printer (connect to a common wifi or via an usb cable), then _System Preferences_ > _Printers & Scanners_ > Add printer and choose your own printer, don't forget to choose Gutenprint as driver!

🔅 For **scanner** app: you can use VueScan (paid) if the current version of app doesn't support chip M1 yet!

🔅 For **Canon MG2900** printer/scanner + apps: you may need to download and install drivers from [this site](https://brothersupportdownloads.blogspot.com/2020/06/canon-pixma-mg2900-scanner-driver.html). A backup files are [here](https://mega.nz/file/U0RwBR6T#qa50uOyhlAEiRtrMm_zBkXPtPufJD2Wa1gtbtkw5W_w). You may find other useful drivers for other types of printers on this site also.

**Scanner app**: use **Image Capture** (built-in app on Mac) or install **Canon IJ Scan Utility2**.

## Finder

1.  Add necessary folder shortcuts to sidebar.
2.  Add recycle Bin to sidebar: [[⇧]] + [[⌘]] + [[.]] to show hidden folders > drag **Bin** folder to sidebar > [[⇧]] + [[⌘]] + [[.]] to hide hidden folders again.
3.  Customize some options in Preferences.
4.  Show status bar: View > Show status bar.

## Screen recorder

1.  Using **QuickTime** / built-in function. Open QuickTime or [[⌘]] + [[⇧]] + [[5]] to open screenshot/recording options. **Weakness**: big size + impossible (or possible??) to record system sounds.
2. Using [OBS](https://obsproject.com/) (for recording app) + [BlackHole](https://github.com/ExistentialAudio/BlackHole) (for bypassing system audio recorder, I chose **2ch** to download).
   1. Check [this article](https://obsproject.com/forum/resources/os-x-capture-audio-with-ishowu-audio-capture.505/) for setting up with OBS (not that, in this article, they use a different tool than BlackHold)
   2. Check [this article](https://streamlabs.com/content-hub/post/capturing-desktop-audio-in-streamlabs-obs-for-mac) for using BlackHole to capture system audio on Mac.
   3. Open **Audio MIDI Setup** > Click on "+" > "Create Multi-Output Device" > Check on (Use side) current using Speaker (ex. External Headphones) + BlackHole 2ch. Check also (Drift Correction) for "External Headphones". Rename to something to remember, e.g. "Screen Recorder". We wanna listen the system audio via 2 output, one is external heaphones, 1 is "virtual" BlackHole (so that it can recorder the sound).
   4. Open **Sound** setting and choose "Screen Recorder". **Tip**: you should adjust the sound before change to "Screen Recorder" because you will not be able to change sound level in this option.
   5. In **OBS**, Add screen, add 2 microphones, one for real mic, one for device BlackHole 2ch.
      1. Open Preferences > Audio: Mic/Aux 1, choose "External microphone", Mic/Aux 2, choose "BlackHole 2ch" > OK.
   6. Some settings for OBS:
      1. Turn off preview for screen (for comfortable)
      2. **Video** > Common FPS Values = 20

## Dictionary

🔅 **Dictionary**: [install Viettien](https://mega.nz/file/x0RgTbhK#1rz1mpsbXXxLmLs1blVk9zLEmI0d5FXk7Bora4Rm9Y0) (I use version 5.0b for Mac Big Sur chip M1). Alternative dictionaries can be downloaded from this link (I backed it up for personally using).

1.  Don't forget to open **Security & Privacy** and click on **Open anyway** many times!
2.  Another option is to install Tinhte's dictionary from this link, copy extracted folder (`Tinhe_anh-viet.dictionary`) to `/Users/thi/Library/Dictionaries/`.
3.  After installing successfully, open Dictionary app > Preferences... > Tick on the names which are corresponding to the installed/copied dictionaries.
4.  There are built-in LacViet dictionaries but they are not activated yet, don't forget them!

🔅 **Goldendict**: download installation [here](https://github.com/goldendict/goldendict/wiki/Early-Access-Builds-for-Mac-OS-X) + dictionaries [here](https://drive.google.com/drive/folders/1jna8_grA-wyhPrq8BiB7ypadvW3tTlIv).

## Others

🔅 Log into email accounts on Mail app.

## Applications

1. [VSCode](https://code.visualstudio.com/download) + sign in to sync using Github account.
2. [Google Chrome](https://www.google.com/chrome/) and sign in to sync.
  1. Disable Tab Hover Cards: navigate to `chrome://flags/`, search for "tab hover" and choose "Disable".
  2. Add a site to use cookies (enable third-party cookies for downloading files on Google Drive): Go to `chrome://settings/cookies` and then "Add" `drive.google.com` (tick on third-party...) in "Sites that can always use cookies" section.
3. Password manager.
4. [Dropbox](https://www.dropbox.com/downloading). We can "quit" the app on dock, the icon on menu still there!
5. [iTerm2](https://iterm2.com/) (check more in other section)
6. [Youtube Music App](https://ytmusic.app/) for Mac (unofficial)
7. [XtraFinder](https://www.trankynam.com/xtrafinder/) (additional settings for Finder)
8.  Communication: [Skype](https://www.skype.com/en/get-skype/), [Zoom](https://zoom.us/download), [Slack](https://slack.com/intl/en-fr/downloads/mac).
9.  [VLC Player](https://www.videolan.org/vlc/download-macosx.html) -- video player.
10. [GitKraken](https://www.gitkraken.com/) + sign in + clone some repos.
11. [CleanMyMac](https://macpaw.com/cleanmymac) (paid) -- uninstaller + optimize your mac.
12. [Paragon NTFS](https://www.paragon-software.com/home/ntfs-mac/) (paid, 20$) -- Do everything with Windows drives on your Mac.
13. [Bartender 4](https://www.macbartender.com/Bartender4/) -- hide some icons on menu bar.
14. Dropdown calendar with agenda: [Itsycal](https://www.mowglii.com/itsycal/). After installing, you have to choose manually the agenda profiles you wanna show.
15. [uBar](https://brawersoftware.com/products/ubar) (paid) -- disable default dock and make a windows-like taskbar. **Be careful**, it takes too much RAM!

🔅 **Appstore**:

1.  The Unarchiver
2.  Communication: Whatsapp Desktop + Messenger App
3.  Skitch -- annotation for photos on Mac.
4.  Word and Powerpoint (in Office 365 suit). You can buy a lifetime license on ebay (not your own email but you can integrate yours later).
5.  Magnet -- arrange window workspace (stick to edge like on Windows).
6.  Amphetamine -- Keep-awake your mac, an alternative to caffein on linux.

## Terminal

🔅 (For chip M1 only)

``` bash
# check if running on ARM or Intel
arch
# arm64 -> ARM
# i386 -> Intel (running with Rosetta)
```

Copy `/Applications/Utilities/Terminal.app` to Download folder, rename it to **Terminal-Rosetta.app**. Move the new to /Applications/Utilities/ again. Right click on Terminal-Rosetta.app > Get Info > Click on "Open using Rosetta".

- If you wanna run commands in Intel environment, use **Terminal-Rosseta**.
- If you wanna run commands in ARM environment, use **Terminal.app**.

🔅 Dropdown terminal with **iTerm2**.

1. Create a new profile and make it default. Download my customized profile [here](https://github.com/dinhanhthi/scripts/blob/master/settings/macos/DropDown.json).
2. Click on new profile > Keys > Tick on "A hotkey..." > Set [[⌘]] + [[`]] for opening window.
3. "Window" tab > Style "Maximized".
4. Rename tab name: [[⌘]] + [[I]] to open tab information!

🔅 **Zsh terminal**:

👉 Note: [Terminal](/terminal).

::: hsbox Code
``` bash
# By default, iTerm2 comes with pre-installed zsh
# You can check current shell
echo $SHELL # should returns /bin/zsh
# Check zsh version
zsh --version

# install oh-my-zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"

# install spaceship theme
git clone https://github.com/denysdovhan/spaceship-prompt.git "$ZSH_CUSTOM/themes/spaceship-prompt"
ln -s "$ZSH_CUSTOM/themes/spaceship-prompt/spaceship.zsh-theme" "$ZSH_CUSTOM/themes/spaceship.zsh-theme"
# Make spaceship as default
# Set ZSH_THEME="spaceship" in your .zshrc.
# Follow this (optional): https://gist.github.com/kevin-smets/8568070
# Download (then open and install) font Source Code Pro:
# https://github.com/powerline/fonts/blob/master/SourceCodePro/Source%20Code%20Pro%20for%20Powerline.otf
# Open iTerm2 Preferences > Profile > Text > change font!

# If you wanna see the changes
source ~/.zshrc
```
:::

## Macbook keyboard symbols

::: hsbox ALl symbols
``` bash
HTML Entity     GLYPH  NAME
&#63743;              Apple
&#8984;         ⌘      Command, Cmd, Clover, (formerly) Apple
&#8963;         ⌃      Control, Ctl, Ctrl
&#8997;         ⌥      Option, Opt, (Windows) Alt
&#8679;         ⇧      Shift
&#8682;         ⇪      Caps lock
&#9167;         ⏏      Eject
&#8617;         ↩      Return, Carriage Return
&#8629; &crarr; ↵      Return, Carriage Return
&#9166;         ⏎      Return, Carriage Return
&#8996;         ⌤      Enter
&#9003;         ⌫      Delete, Backspace
&#8998;         ⌦      Forward Delete
&#9099;         ⎋      Escape, Esc
&#8594; &rarr;  →      Right arrow
&#8592; &larr;  ←      Left arrow
&#8593; &uarr;  ↑      Up arrow
&#8595; &darr;  ↓      Down arrow
&#8670;         ⇞      Page Up, PgUp
&#8671;         ⇟      Page Down, PgDn
&#8598;         ↖      Home
&#8600;         ↘      End
&#8999;         ⌧      Clear
&#8677;         ⇥      Tab, Tab Right, Horizontal Tab
&#8676;         ⇤      Shift Tab, Tab Left, Back-tab
&#9250;         ␢      Space, Blank
&#9251;         ␣      Space, Blank
```
:::
