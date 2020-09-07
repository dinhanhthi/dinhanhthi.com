---
layout: post
title: "Working style"
categories: [skills]
notfull: 1
keywords: "work with git on local coding style code branch git class"
---

{% include toc.html %}

I note some of my ways in working.

## Work with this site note

1. Any additional notes, remember to add key words to `keywords` section in the frontmatter.
2. At the end of each month, update [My learning log](/my-learning-log).
3. Any changes on style of this website, make an update to branch `template`.

## Git `ssh` on local

1. Download git desktop: [Github Desktop](https://desktop.github.com/) (Windows and MacOS), [GitKraken](https://www.gitkraken.com/download) (Windows, Linux, MacOS).
2. Clone a ssh repo by terminal (I use [cmder](https://cmder.net/))
3. Any change, stage and commit in git desktop.
4. Push or pull or any remote connecting by terminal (in order to input the password).

## Coding style

0. Check others in [this note](/pep-8).
1. The name of some "not important" function in a class should start with `_`, e.g. `_find_min()`.
2. The name of some "not important" branch in `git` should start with `_`, e.g. `_modify_theme`.