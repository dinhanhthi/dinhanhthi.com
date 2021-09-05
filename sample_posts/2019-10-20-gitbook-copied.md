---
layout: post
title: "Gitbook"
tags: [Web Dev, Git]
toc: true
icon: gitbook.png
notfull: 1
---

{% assign img-url = '/img/post/web-dev' %}

## URLs

- [Gitbook homepage](https://gitbook.com).
- [Gitbook Docs](https://docs.gitbook.com).
- [Emoji Copy](https://www.emojicopy.com/) (You cannot use `:blush:` in the markdown file, you need to copy icon itself).

## Setting up

File `book.json` needs to be placed in the root of your gitbook repository on Github. Below are some settings that I have used.

~~~ bash
{
	"plugins": [
		"mathjax"
	],
	"pluginsConfig": {
		"mathjax":{
				"forceSVG": true
		}
	}
}
~~~

## Math in Gitbook

You have to use `$$a+b$$` instead of `$a+b$` for inline math. Others are the same as normal expressions in Markdown.

## Blocks

### Boxes

Info blocks,

~~~ liquid {% raw %}
{% hint style="info" %}
Hint blocks.
<br />Line break.
{% endhint %}
{% endraw %}
~~~

Danger blocks,

~~~ liquid {% raw %}
{% hint style="danger" %}
Content.
{% endhint %}
{% endraw %}
~~~

Success blocks,

~~~ liquid {% raw %}
{% hint style="success" %}
Content.
{% endhint %}
{% endraw %}
~~~

Warning blocks,

~~~ liquid {% raw %}
{% hint style="warning" %}
Content.
{% endhint %}
{% endraw %}
~~~

### Code blocks

~~~ liquid {% raw %}
{% code-tabs %}
{% code-tabs-item title="book.json" %}
```bash
cd directory/
```
{% endcode-tabs-item %}
{% endcode-tabs %}
{% endraw %}
~~~

### Box with tabs

~~~ liquid {% raw %}
{% tabs %}
{% tab title="First Tab" %}
Content of tab 1.
{% endtab %}

{% tab title="Second Tab" %}
Content of tab 2.
{% endtab %}
{% endtabs %}
{% endraw %}
~~~

### Tasks

~~~ liquid {% raw %}
* [x] Task 1
* [ ] Task 2
* [ ] Task 3
{% endraw %}
~~~