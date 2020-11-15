---
title: Insert code
description: Testing everything about insertin a code
date: 2020-09-12
tags: [default, code]
layout: layouts/post.njk
excerpt: true
---

This is the 1st paragraph used to be an excerpt for this post.

## Problem with `<pre><code></code></pre>` & indent?

Check this [official solution](https://www.11ty.dev/docs/languages/markdown/#there-are-extra-and-in-my-output).

## Inline code

Test with inline code like this `\begin{document}`.

## Highlight lines

``` js/2-3
// this is a command
function myCommand() {
	let counter = 0;
	counter++;
}

// Test with a line break above this line.
console.log('Test');
```

``` js/2/4
// this is a command
function myCommand() {
	let counter = 0;

	counter++;
}

// Test with a line break above this line.
console.log('Test');
```

## Different languages

[List](https://prismjs.com/#languages-list) of supported languages.

Latex

``` latex
\begin{document}
    \dfrac{1}{2}
\end{document}
```

{% highlight latex %}
\begin{document}
    \dfrac{1}{2}
\end{document}
{% endhighlight %}

Python

``` python/2
class MyClass()
    def method(arg):
        print(arg)
```