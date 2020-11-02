---
layout: post
title: "VSCode"
categories: [skills]
tags: ['ide', installation]
icon-photo: vsc.svg
keywords: "visual studio code vsc regex regular expression ssh remote server character combining font ligatures couple characters symbols letters new characters installation install extension plugin add extra path to auto complete reStructuredText rst markdown extension pythonremote regular expression regex vscode live server scss css compiler"
---

{% include toc.html %}

## Install

Download and install [here](https://code.visualstudio.com/).

## Extensions

``` bash
# list the installed extensions
# unix
code --list-extensions | xargs -L 1 echo code --install-extension
# windows
code --list-extensions | % { "code --install-extension $_" }

# To re-install on a new machine
# just copy-paste the results and run on terminal
```

{% hsbox my favorite extensios %}
``` bash
code --install-extension bierner.markdown-emoji
code --install-extension bierner.markdown-preview-github-styles
code --install-extension CoenraadS.bracket-pair-colorizer
code --install-extension eamodio.gitlens
code --install-extension formulahendry.auto-close-tag
code --install-extension himanoa.Python-autopep8
code --install-extension James-Yu.latex-workshop
code --install-extension lextudio.restructuredtext
code --install-extension mdickin.markdown-shortcuts
code --install-extension mhutchie.git-graph
code --install-extension mrmlnc.vscode-apache
code --install-extension ms-azuretools.vscode-docker
code --install-extension ms-mssql.mssql
code --install-extension ms-python.python
code --install-extension ms-vscode-remote.remote-containers
code --install-extension ms-vscode-remote.remote-ssh
code --install-extension ms-vscode-remote.remote-ssh-edit
code --install-extension ms-vscode-remote.remote-wsl
code --install-extension ms-vscode-remote.vscode-remote-extensionpack
code --install-extension Perkovec.emoji
code --install-extension ritwickdey.live-sass
code --install-extension ritwickdey.LiveServer
code --install-extension ronnidc.nunjucks
code --install-extension SolarLiner.linux-themes
code --install-extension streetsidesoftware.code-spell-checker
code --install-extension yzhang.markdown-all-in-one
code --install-extension zxh404.vscode-proto3
```
{% endhsbox %}



### reStructuredText

`preview engine sphinx is not installed` => in Ubuntu 20.04+

``` bash
sudo apt install python-is-python3
# prevent Python 2 from being installed as a dependency of something
sudo apt-mark hold python2 python2-minimal python2.7 python2.7-minimal libpython2-stdlib libpython2.7-minimal libpython2.7-stdlib
```

## Add extra path to auto complete

Open `settings.json` and add,

~~~ json
{
    "python.autoComplete.extraPaths": [
        "C:\\Users\\dinha\\Documents\\GitHub\\dataswati\\python-dataswati"
    ],
}
~~~

### Fix Pylint unable to import

Open `settings.json` and add,

~~~ json
"python.linting.pylintArgs": [
    "--init-hook",
    "import sys; sys.path.append('C:\\Users\\dinha\\Documents\\GitHub\\dataswati\\python-dataswati')"
]
~~~

## Appearances

### Change font for internal terminal

Make a good corresponding to [zsh](/terminal#zsh-linux).

``` bash
# Open settings JSON
"terminal.integrated.cursorStyle": "line",
"terminal.integrated.fontFamily": "Source Code Pro Medium",
"terminal.integrated.fontSize": 15
```

### Enable font ligatures

👉 [Reference](https://dev.to/macmacky/my-vscode-shortcuts-settings-and-extensions-for-productivity-3chd).

For example, you type <kbd>=</kbd> + <kbd>></kbd>, it becomes `⇒`.

1. Download [Fira Code Font](https://www.fontsquirrel.com/fonts/fira-code).
2. Extract and then install the font after that.
    ~~~ json
{
    "editor.fontFamily": "'Fira Code', 'Consolas', 'Courier New', monospace",
    "editor.fontLigatures": true
}
    ~~~
3. Reload VSC.

💡 If you only wanna apply this setting for some file format, you can click on the language at the bottom right of VSC, then click **Configure 'Markdown' language based setting**.

## Regular Expression

-  Using regular expression in Visual Studio (Code) ⇾ [ref](https://docs.microsoft.com/en-us/visualstudio/ide/using-regular-expressions-in-visual-studio?view=vs-2017)
- Replace current bit.ly text with its same url:
    - Find: `(http://bit.ly.*)` (Enable `.*`)
    - Replace: `[$1]($1)`
- Replace `**Course 1**` by `Course 1`:
  - Find: `\*\*Course (.*)\*\*`
  - Replace: `Course $1`


## Exlude files/folders in file search Visual Studio Code (VSC)

Go to **Preferences** > **Settings** > search `exclude` and modify inside section `Search: Exclude`. More patterns can be found [here](https://code.visualstudio.com/docs/editor/codebasics#_advanced-search-options).

Below is an example list,

~~~
**/node_modules
**/bower_components
**/*.code-search
**/_site
**/.jekyll-cache
**/.sass-cache
**/*.ico
**/*.png
**/*.ipynb
**/*.jpg
**/*.jpeg
**/*.svg
~~~

## Connect `ssh` folders in VSC

Read [this tutorial](https://code.visualstudio.com/blogs/2019/07/25/remote-ssh).

1. Install extension [Remote - SSH](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh)
2. **View** > **Command Palette...** > type "SSH" and choose "_Remote-SSH: Connect to Host..._" > choose "_+ Add New SSH Host..._"
3. Type `ssh user@host` > <kbd>Enter</kbd> > choose a file to be updated, e.g. `~/.ssh/config`.
4. Click **Connect** if there is any popup in VSC.
5. Choose platform on the server, usually Linux.

### Error?

``` bash
# Could not establish connection to "undefined". Could not resolve hostname.
# ref: https://github.com/microsoft/vscode-remote-release/issues/1047

# Open config ssh file
# Ctrl+Shift+P then "Remote-SSH: Open Configuration File"

# In stead of
Host XXX.XXX.XXX.XXX
User bob
Port 22
IdentityFile ~/.ssh/id

# use this
Host server_name # Do not put ip here
HostName XXX.XXX.XXX.XXX # But put it here
User bob
Port 22
IdentityFile ~/.ssh/id

# Then Ctrl+Shift+P > "Remote-SSH: Connect to host"
# Pick "server_name"
```


## Settings

👉 Check [this file](https://github.com/dinhanhthi/scripts/blob/master/settings/VSC_settings.json).

Use settings for a custom file extension,

``` json
# the list of extension name will be showed when typing
"[markdown]": {
    "editor.tabSize": 4,
},
"[restructuredtext]": {
    "editor.wordWrap": "on",
}
```

## Pylint

``` bash
# _Unable to import_ some user-defined package
# 1. Make sure the right env running in vscode
# For example, popai (conda)
# 2. Make a symblic link
ln -s /home/thi/git/dataswati/python-dataswati/popai /home/thi/miniconda3/envs/popai/lib/python3.8/popai
```

``` bash
# unresolved import
# Ctrl + Shift + P
# Preferences: Open Workspace Settings (JSON)
"settings": {
    "python.pythonPath": "/usr/bin/python3",
    "python.autoComplete.extraPaths": [
        "/usr/lib/python3/dist-packages",
        "/app/src/python/"
        # or other paths you want!
    ]
}
```

## Hot keys

One can change the default keyboard shortcut by going to: **File** > **Preferences** > **Keyboard Shortcuts**.

- Quick search file: <kbd>Ctrl</kbd> + <kbd>P</kbd>.
- Get back to previous views: <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>-</kbd> (Linux), <kbd>Alt</kbd> + <kbd><</kbd> (Windows), <kbd>Ctrl</kbd> + <kbd>-</kbd> (MacOS).
- Get forward: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>-</kbd> (Linux), <kbd>Alt</kbd> + <kbd>></kbd> (Windows), <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>-</kbd> (MacOS).
- Open Command Palette: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>.
- Forat on save: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>I</kbd>.
- Go to line: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> then _Go to line_.
