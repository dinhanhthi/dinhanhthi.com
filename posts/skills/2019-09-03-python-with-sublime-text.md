---
layout: post
title: "Sublime Text 3"
tags: [Skills]
toc: true
icon: sublime.png
keywords: "theme sublime text IDE tabnine build system anaconda python"
---

{% assign img-url = '/img/post/python' %}

This instruction taken from [a video](https://www.youtube.com/watch?v=xFciV6Ew5r4) of Corey Schafer. You need to install [Sublime Text 3](https://www.sublimetext.com/3) and its [Package Control](https://packagecontrol.io/installation) to do below stuffs.

## Theme

Install theme **[Predawn](https://packagecontrol.io/packages/Predawn)** and **Material Theme**:

1. Open **Command Palette** (*Tool* > *Command Palette* or <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>). Type `install` to open `Package Control: Install Package`.
2. Search and install `Predawn` and `Material Theme`.

## Personal settings

Open **Preferences** > **Settings**, replace the content in tab `-User` by,

{% hsbox "Show settings" %}

~~~ json
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
	"folder_exclude_patterns": [".svn", ".git", ".hg", "CVS",
		"_site", "vendor", ".jekyll-cache", "img"
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

{% endhsbox %}

## Useful packages

Install other useful packages (the same way as installing Predawn):

{:.indent}
- **BracketHighlighter**: indicate the paired bracket.
- **SidebarEnhancement**: add more options to sidebar.
- **TabNine**: autocomplete extension using deep learning.

## Python

### Packages

- **Anaconda**: after installing this package, go go **Preferences** > **Package settings** > **Anaconda** > **Settings - Users** > paste following content,

	<div class="hsbox">
	<div class="hs__title">
	Show settings
	</div>
	<div class="hs__content">

	~~~ json
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
	</div>
	</div>

### Custom Build Systems

If you wanna create different Build Systems w.r.t different versions of Python: **Tools** > **Build System** > **New Build System...** > paste following codes (replace the directory to the directory of Python version that you want to use).

~~~ json
{
  "cmd": ["/home/thi/anaconda3/bin/python", "-u", "$file"],
  "file_regex": "^[ ]*File \"(...*?)\", line ([0-9]*)",
  "quiet": true
}
~~~

In order to run codes, you need to choose the build system first, then use <kbd>Ctrl</kbd> + <kbd>B</kbd>.

## Markdown

- Install package __MarkdownEditting__.
- Change hotkeys: __Prefereces__ > __Package Settings__ > __Markdown Editing__ > __Key Bindings - User__

	<div class="hsbox">
	<div class="hs__title">
	Show settings
	</div>
	<div class="hs__content">

	~~~ json
	[
		{ "keys": ["ctrl+b"], "command": "run_macro_file", "args": {"file": "Packages/MarkdownEditing/macros/Transform Word - Bold.sublime-macro"}, "context":
			[
				{ "key": "selection_empty", "operator": "equal", "operand": true, "match_all": true },
				{ "key": "selector", "operator": "equal", "operand": "text.html.markdown", "match_all": true }
			]
		},
		{ "keys": ["ctrl+b"], "command": "insert_snippet", "args": {"contents": "${MD_BOLD_MARKER}$1${MD_BOLD_MARKER}"}, "context":
			[
				{ "key": "setting.auto_match_enabled", "operator": "equal", "operand": true },
				{ "key": "selection_empty", "operator": "equal", "operand": true, "match_all": true },
				{ "key": "following_text", "operator": "regex_contains", "operand": "^(?:\t| |\\)|]|\\}|$)", "match_all": true },
				{ "key": "preceding_text", "operator": "not_regex_contains", "operand": "['a-zA-Z0-9_]$", "match_all": true },
				{ "key": "eol_selector", "operator": "not_equal", "operand": "string.quoted.single", "match_all": true },
				{ "key": "selector", "operator": "equal", "operand": "text.html.markdown", "match_all": true }
			]
		},
		{ "keys": ["ctrl+b"], "command": "insert_snippet", "args": {"contents": "${MD_BOLD_MARKER}${SELECTION/(^[\\*_]*|[\\*_]*$)//g}${MD_BOLD_MARKER}"}, "context":
			[
				{ "key": "setting.auto_match_enabled", "operator": "equal", "operand": true },
				{ "key": "selection_empty", "operator": "equal", "operand": false, "match_all": true },
				{ "key": "selector", "operator": "equal", "operand": "text.html.markdown", "match_all": true }
			]
		},
		{ "keys": ["ctrl+b"], "command": "run_macro_file", "args": {"file": "Packages/MarkdownEditing/macros/Transform Word - Unbold Unitalicize.sublime-macro"}, "context":
			[
				{ "key": "selection_empty", "operator": "equal", "operand": true, "match_all": true },
				{ "key": "preceding_text", "operator": "regex_contains", "operand": "\\b__+\\S+__+$", "match_all": true },
				{ "key": "selector", "operator": "equal", "operand": "text.html.markdown", "match_all": true }
			]
		},
		// italics on Alt + I
		{ "keys": ["alt+i"], "command": "run_macro_file", "args": {"file": "Packages/MarkdownEditing/macros/Transform Word - Italic.sublime-macro"}, "context":
			[
				{ "key": "selection_empty", "operator": "equal", "operand": true, "match_all": true },
				{ "key": "selector", "operator": "equal", "operand": "text.html.markdown", "match_all": true }
			]
		},
		{ "keys": ["alt+i"], "command": "insert_snippet", "args": {"contents": "${MD_ITALIC_MARKER}$0${MD_ITALIC_MARKER}"}, "context":
			[
				{ "key": "setting.auto_match_enabled", "operator": "equal", "operand": true },
				{ "key": "selection_empty", "operator": "equal", "operand": true, "match_all": true },
				{ "key": "following_text", "operator": "regex_contains", "operand": "^(?:\t| |\\)|]|\\}|$)", "match_all": true },
				{ "key": "preceding_text", "operator": "not_regex_contains", "operand": "['a-zA-Z0-9_]$", "match_all": true },
				{ "key": "eol_selector", "operator": "not_equal", "operand": "string.quoted.single", "match_all": true },
				{ "key": "selector", "operator": "equal", "operand": "text.html.markdown", "match_all": true }
			]
		},
		{ "keys": ["alt+i"], "command": "insert_snippet", "args": {"contents": "${MD_ITALIC_MARKER}${SELECTION/(^[\\*_]*|[\\*_]*$)//g}${MD_ITALIC_MARKER}"}, "context":
			[
				{ "key": "setting.auto_match_enabled", "operator": "equal", "operand": true },
				{ "key": "selection_empty", "operator": "equal", "operand": false, "match_all": true },
				{ "key": "selector", "operator": "equal", "operand": "text.html.markdown", "match_all": true }
			]
		},
		{ "keys": ["alt+i"], "command": "insert_snippet", "args": {"contents": "${SELECTION/(^[\\*_]|[\\*_]$)//g}"}, "context":
			[
				{ "key": "selection_empty", "operator": "equal", "operand": false, "match_all": true },
				{ "key": "text", "operator": "regex_match", "operand": "^[*_].*[*_]$", "match_all": true },
				{ "key": "selector", "operator": "equal", "operand": "text.html.markdown", "match_all": true }
			]
		},
		{ "keys": ["alt+i"], "command": "run_macro_file", "args": {"file": "Packages/MarkdownEditing/macros/Transform Word - Unbold Unitalicize.sublime-macro"}, "context":
			[
				{ "key": "selection_empty", "operator": "equal", "operand": true, "match_all": true },
				{ "key": "selector", "operator": "equal", "operand": "text.html.markdown markup.italic.markdown", "match_all": true }
			]
		},
		{ "keys": ["alt+i"], "command": "run_macro_file", "args": {"file": "Packages/MarkdownEditing/macros/Transform Word - Unbold Unitalicize.sublime-macro"}, "context":
			[
				{ "key": "selection_empty", "operator": "equal", "operand": true, "match_all": true },
				{ "key": "preceding_text", "operator": "regex_contains", "operand": "\\b_(?!_)\\S+_$", "match_all": true },
				{ "key": "selector", "operator": "equal", "operand": "text.html.markdown", "match_all": true }
			]
		},
		// run paste as link command on selected text
		{ "keys": ["ctrl+k"], "command": "reference_new_inline_link", "context":
			[
				{ "key": "setting.mde.keymap_disable.reference_new_inline_link", "operator": "not_equal", "operand": true },
				{ "key": "selector", "operator": "equal", "operand": "text.html.markdown", "match_all": true }
			]
		},
		{ "keys": ["shift+alt+b"], "command": "toggle_side_bar" },
	]
	~~~
	</div>
	</div>
- Make main window be on left (not center): __Prefereces__ > __Package Settings__ > __Markdown Editing__ > Markdown GFM Settings - User

	``` json
	{
		"color_scheme": "Packages/Predawn/predawn.tmTheme",
		"draw_centered": false,
		"highlight_line": true,
	}
	```