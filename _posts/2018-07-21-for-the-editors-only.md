---
layout: post
title: "For me only"
subtitle: restricted area
tags: [others]
categories: others
math: 1
date: 2019-04-18
---

<div class="alert alert-warning" role="alert" markdown="1">
This post is only for me to write the posts, please read [**others**](/blog).
</div>

## Front matter

<div class="alert alert-success" role="alert" markdown="1">
If you don't want to use any item below, don't write it down. `math: 0` will be considered similarly to `math: 1` and jekyll understand that they are the same unless you don't write either of them.
</div>

- `math: 1` : only add if you wanna use math equations inside post.
- `categories`: categories among `others`, `math`, `data-science`, `machine-learning`.
- `img`: thumbnail of the post .
- `bigimg`: background photo of the post (showing on shared post on facebook)
- `update: 1`: if you just update the content of the post. Notice that, the badge "update" is only showed if the updated date is under 7 days.


## Inset figures

- Normal inserting: `![Describe](link/to/figures)`
- Full width: `{% raw %}{% include img/full.html src="link/to/figures" des="description" %}{% endraw %}`
- Full but modified: `{% raw %}{% include img/full-normal.html src="link/to/figures" des="description" %}{% endraw %}`
- Full but 50% width: `{% raw %}{% include img/full-50.html src="link/to/figures" des="description" %}{% endraw %}`
- Float to right: `{% raw %}{% include img/right.html src="link/to/figures" des="description" %}{% endraw %}`
- Float to left: `{% raw %}{% include img/left.html src="link/to/figures" des="description" %}{% endraw %}`


## Side by side figure and content

- Figure on the left:

	~~~ html
  <div class="row align-items-center img-aside">
  <p class="col-md-6" markdown="1">
  ![Description](/link/to/figure)
  </p>
  <p class="col-md-6" markdown="1">
  Contents
  </p>
  </div>
	~~~

- Figure on the right (but above on a smaller view port):

	~~~ html
  <div class="row align-items-center img-aside">
  <p class="col-md-6 order-md-2" markdown="1">
  ![Description](/link/to/figure)
  </p>
  <p class="col-md-6 order-md-1" markdown="1">
  Contents.
  </p>
  </div>
	~~~

## Insert codes

- If you wanna add tag `{{"{% this "}}%}`, use alert`{% raw %}{{"{% this "}}%}{% endraw %}`.
- If you like this `{{"{{ this "}}}}`, use `{% raw %}{{"{{ this "}}}}{% endraw %}`.
- **The rule**: use `{% raw %}{{"{% endraw %}` before the key-word and end with `{% raw %}"}}{% endraw %}` before the end of key-word.
- **An easier way**: use `{{ "{% raw " }}%}` and `{{ "{% endraw " }}%}` around the key-word. These two commands are also used for a block of codes,

	~~~
~~~ {{ "{% raw " }}%}{% raw %}{% for %}
// line of codes
{% end for %}{% endraw %}{{ "{% endraw " }}%} ~~~
	~~~

	**Tips**: For a beautiful display, put `{{ "{% raw " }}%}` and `{{ "{% endraw " }}%}` exactly like the above code.

## Insert boxes

- Terminal box

	~~~ html
  <div class="terminal">
  $ sudo apt-get update
  </div>
	~~~

- Warning bootstrap : [here](https://getbootstrap.com/docs/4.1/components/alerts/){:target="_blank"}.
	- Success box (green):

		~~~ html
	  <div class="alert alert-success" role="alert" markdown="1">
	  Content
	  </div>
		~~~

	- Warning (yellow)

		~~~ html
	  <div class="alert alert-warning" role="alert" markdown="1">
	  Content
	  </div>
		~~~

	- Danger (red)
		~~~ html
	  <div class="alert alert-danger" role="alert" markdown="1">
	  Content
	  </div>
		~~~

	<div class="alert alert-warning" role="alert" markdown="1">
	If you wanna insert a block of math inside above boxes, don't foget to wrap them inside a p tag.
	</div>

- Quotes I like (hide/show)

	~~~ html
  <div class="tomTat">
  <div id="btTomTat" class="collapsed" data-toggle="collapse" href="#ndTomTat">
	<span>Highlights I like</span>
  </div>
  <div id="ndTomTat" markdown="1" class="collapse multi-collapse ndTomTat">
  Contents.
  </div>
  </div>
	~~~

- Definition box

	~~~ html
	<div class="def-box" markdown="1" id="dn1">
	<div class="box-title" markdown="1">
	Title
	</div>
	<div class="box-content" markdown="1">
	Content
	</div>
	</div>
	~~~

## Steps

~~~ html
<div  class="thi-step">

<div class="step">
<div class="step-number"></div>
<div class="step-content" markdown="1">
Content of step 1.
</div>
</div>

<div class="step">
<div class="step-number"></div>
<div class="step-content" markdown="1">
Content of step 2.
</div>
</div>

</div>
~~~

## Fonts & Texts

- Info

	~~~ html
  <h4 class="post-more">Information</h4>
	~~~

- Marked texts: `<mark>texts</mark>`
- Keyboard: `<kbd>B</kbd>`
- More link:
	~~~html{% raw %}
{% include more.html content="[text](link)" %}
	{% endraw %}~~~
- Subject: `<sbj>Texts</sbj>`
- Hide/show description for links

	~~~html{% raw %}
[**Title**](link){:target="_blank"} other texts. [*(my comments)*](#des-1){:data-toggle="collapse" .my-des}
	<des id="des-1" class="collapse multi-collapse">descriptions</des>
	{% endraw %}~~~

## Math expressions

- Inline math, use `$math-expression$`
- Block of math, use `$$math block$$` or

	~~~ latex
  $$
  x^n + y^n = z^n
  $$
	~~~

- If you wanna insert some special characters, you must put `\` before this character, for instance, `\\{ 1,2,3 \\}` gives $\\{ 1,2,3 \\}$
- If you type inline maths which contain chatacters `_`, you must add `\` before each of them, for example, `a\_1` give $a\_1$.
- Don't use `||` for absolute values, let's use `\vert \vert` instead.
- Don't use `\left\| \right\|` for norms, use `\Vert \Vert` instead.
- Don't use `*` for star symbols, use `\ast` instead.
- If you wanna type `\\`, type `\\\\` instead.
- If you wanna type an inline matrix, e.g., $[A]=\begin{bmatrix}1 & 2 \\\\ 2 & 3.999 \end{bmatrix}$, type like below,

	~~~ latex
  $[A]=\begin{bmatrix}1 & 2 \\\\ 2 & 3.999 \end{bmatrix},$
	~~~

- In order to use `\label{}` and `\eqref{}` like in latex, use

	~~~ latex
  $$
  \begin{align}\tag{1}\label{eq1}
  x^n + y^n = z^n
  \end{align}
  $$

  Call again equation $\eqref{eq1}$.
	~~~

- You don't need an enviroment `align` or `equation` to use `\label`, you can use it with `$$` only, for example,

	~~~ latex
  $$
  x^n + y^n = z^n \tag{1}\label{eq1}
  $$

  Call again equation $\eqref{eq1}$.
	~~~
