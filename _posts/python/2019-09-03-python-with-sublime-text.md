---
layout: post
title: "Python with Sublime Text"
categories: [python]
tags: ['ide', 'installation']
icon-photo: sublime.png
keywords: "theme sublime text IDE tabnine build system anaconda"
---

{% assign img-url = '/img/post/python' %}

{% include toc.html %}

This instruction taken from [a video](https://www.youtube.com/watch?v=xFciV6Ew5r4) of Corey Schafer. You need to install [Sublime Text 3](https://www.sublimetext.com/3) and its [Package Control](https://packagecontrol.io/installation) to do below stuffs.

## Theme

Install theme **[Predawn](https://packagecontrol.io/packages/Predawn)**{:.tbrown} and **Material Theme**{:.tbrown}:

1. Open **Command Palette** (*Tool* > *Command Palette* or <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>). Type `install` to open `Package Control: Install Package`.
2. Search and install `Predawn` and `Material Theme`.

## Personal settings

Open **Preferences** > **Settings**, replace the content in tab `-User` by,

~~~ bash
{
  	"bold_folder_labels": true,
  	"caret_extra_width": 1,
  	"caret_style": "phase",
  	"close_windows_when_empty": false,
  	"color_scheme": "Packages/Predawn/predawn.tmTheme",
  	"copy_with_empty_selection": false,
  	"detect_indentation": false,
  	"drag_text": false,
  	"draw_minimap_border": true,
  	"enable_tab_scrolling": false,
  	"ensure_newline_at_eof_on_save": true,
  	"file_exclude_patterns":
  	[
    		"*.pyc",
    		"*.pyo",
    		"*.exe",
    		"*.dll",
    		"*.obj",
    		"*.o",
    		"*.a",
    		"*.lib",
    		"*.so",
    		"*.dylib",
    		"*.ncb",
    		"*.sdf",
    		"*.suo",
    		"*.pdb",
    		"*.idb",
    		".DS_Store",
    		"*.class",
    		"*.psd",
    		"*.sublime-workspace"
  	],
  	"font_face": "Source Code Pro",
  	"font_options":
  	[
  		  "no_round"
  	],
  	"font_size": 13,
  	"highlight_line": true,
  	"highlight_modified_tabs": true,
  	"ignored_packages":
  	[
  		  "Vintage"
  	],
  	"line_padding_bottom": 1,
  	"line_padding_top": 1,
  	"match_brackets_content": true,
  	"match_selection": true,
  	"match_tags": false,
  	"material_theme_accent_graphite": true,
  	"material_theme_compact_sidebar": true,
  	"open_files_in_new_window": false,
  	"overlay_scroll_bars": "enabled",
  	"preview_on_click": false,
  	"scroll_past_end": true,
  	"scroll_speed": 5.0,
  	"shift_tab_unindent": true,
  	"show_definitions": false,
  	"show_encoding": true,
  	"show_errors_inline": false,
  	"show_full_path": false,
  	"sidebar_default": true,
  	"tab_size": 2,
  	"theme": "Adaptive.sublime-theme",
  	"translate_tabs_to_spaces": true,
  	"trim_trailing_white_space_on_save": true,
  	"use_simple_full_screen": true,
  	"word_wrap": true
}
~~~

## Useful packages

Install other useful packages (the same way as installing Predawn):

- **BracketHighlighter**{:.tbrown}: indicate the paired bracket.
- **SidebarEnhancement**{:.tbrown}: add more options to sidebar.
- **Anaconda**{:.tbrown}: after installing this package, go go **Preferences** > **Package settings** > **Anaconda** > **Settings - Users** > paste following content,

    ~~~ bash
  {
    "auto_formatting": true,
    "autoformat_ignore":
    [
      "E309",
      "E501"
    ],
    "pep8_ignore":
    [
      "E309",
      "E501"
    ],
    "anaconda_linter_underlines": false,
    "anaconda_linter_mark_style": "none",
    "display_signatures": false,
    "disable_anaconda_completion": true
  }
    ~~~
- **TabNine**{:.tbrown}: autocomplete extension using deep learning.

## Different Build Systems

If you wanna create different Build Systems w.r.t different versions of Python: **Tools** > **Build System** > **New Build System...** > paste following codes (replace the directory to the directory of Python version that you want to use).

~~~ bash
{
  "cmd": ["/home/thi/anaconda3/bin/python", "-u", "$file"],
  "file_regex": "^[ ]*File \"(...*?)\", line ([0-9]*)",
  "quiet": true
}
~~~

In order to run codes, you need to choose the build system first, then use <kbd>Ctrl</kbd> + <kbd>B</kbd>.


