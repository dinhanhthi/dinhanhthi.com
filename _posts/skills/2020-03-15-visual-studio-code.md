---
layout: post
title: "Visual Studio Code (VSC)"
categories: [skills]
icon-photo: vsc.svg
keywords: "visual studio code vsc regex regular expression ssh remote server character combining font ligatures couple characters symbols letters new characters installation install extension plugin"
---

{% include toc.html %}

## Install

Download and install [here](https://code.visualstudio.com/).

## Extensions

You can find easily with their names in the marketplace (builtin with VSC)

<div class="two-columns-list" markdown="1">
1. [Bracket Pair Colorizer](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer)
2. [Markdown All in One](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one)
3. [Markdown Shortcuts](https://marketplace.visualstudio.com/items?itemName=mdickin.markdown-shortcuts)
4. [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python)
5. [Remote Development](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)
</div>

## Enable font ligatures{% ref https://dev.to/macmacky/my-vscode-shortcuts-settings-and-extensions-for-productivity-3chd %}

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
