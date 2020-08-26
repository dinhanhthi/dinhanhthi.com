---
layout: post
title: "For me only"
categories: [others]
math: 1
icon: "fas fa-pencil-ruler"
icon-color: "#ffd661"
jsxgraph: 1
sitemap: false
keywords: "front matter table of content hide show box alert box insert code insert figure photo video jemoji emotion full width mathjax katex check box terminal box definition steps font texts badge reference for me only cms admin jekyll emoji emotion icon localhost"
---

{% include toc.html %}

## Front matter

{:.alert.alert-success}
If you don't want to use any item below, don't write it down. `math: 0` will be considered similarly to `math: 1` and jekyll understands that they are the same unless you don't write either of them.

- `math: 1` : only add if you wanna use math equations inside post. Jump to [this section](#math-expressions).
- `categories: [cat1, cat2]` : add the categories/topics for posts. Current categories on this site: {% for category in site.categories reversed %}{% capture category_name %}{{ category | first }}{% endcapture %}<a href="{{site.url}}{{site.baseurl}}/#{{category_name | replace: " ","_"}}">{{ category_name }}</a>{% if forloop.length > 1 and forloop.last != true %}, {% else %}.{% endif %}{% endfor %}
- `tags: [tag1, tag2]`: tags. Current tags in this site: check [this](/tags).
- `custom-css` : if some page or post has different css, indicate it here.
- `toc: 1` : if you wanna show the table of contents for this post. Jump to [this section](#add-table-of-contents).
- `excluded_in_search: 1` : if you think that some post/page containing jekyll expressions that may lead to some errors in the search page. If you add this, this post won't be included in the search page.
- `jsxgraph: 1` : if you use JSXGraph in your post. Jump to [this section](#insert-jsxgraph).
- `sitemap: false` : If you would like to exclude specific pages/posts from the sitemap.
- `subtitle` : Only used for pages.
- `katex: 1` if you wanna use [katex](https://katex.org/) in this page. Remember to wrap the content with `{%raw%}{% katexmm %}{% endkatexmm %}{%endraw%}`.
- Icon/Photo in the header of the post/page:
  - `emoji` : (e.g. `":chicken:"`) if you wanna display an emoji icon in the header for that page/post. Jump to [this section](#jemoji).
  - `icon` : (e.g. `"fas fa-book-reader"`) if you wanna display an icon for that in the header for that page/post.
  - `icon-color` : (e.g. `#ffeead`) if you wanna set a color for that icon.
  - `icon-photo: jekyll.png` : header photo for your post (if it exists). Photos must be stored in `/img/header/`.
- `toc: 1` if you wanna show the table of content in your site.
- `notfull: 1` if the note is not good enough.
- `hide: 1` if you wanna hide some post from `/notes` (it's still available in other pages)

## TOC

Either use `toc: 1` in the frontmatter or add

~~~
{%raw%}{% include toc.html %}
{%endraw%}~~~

## CMS

Only work on `localhost`: [http://localhost:4000/admin](http://localhost:4000/admin).


## Open in HTML - in Colab for Python Notes

- Jupyter notebooks and their exported html files must be placed in `/files/jupyter_notebooks/`.
- The notebook must be named exactly the same as the note's url. For example, if the note's url is `/data-combining`, the notebook's name should be `data-combining.ipynb`.

~~~ html
{% raw %}{% include note_html_colab.html %}{% endraw %}
~~~

This will create automatically 2 button containing the link to open the html file and open the notebook in the

## Learning log

~~~
{%raw%}{% data_ml %}

{% python %}

{% web %}

{% tech %}

{% workflow %}
{%endraw%}~~~

## Insert youtube videos

For example, if the video's URL is `youtube.com/watch?v=57oX5RMHHdQ`, use below codes:

~~~ liquid
{% raw %}{% include youtube.html content="57oX5RMHHdQ" des="Video's description." %}{% endraw %}
~~~

## Insert tables

- Using [this online tool](http://www.tablesgenerator.com/markdown_tables).
- Using classes corresponding to [tables in Bootstrap](https://getbootstrap.com/docs/4.0/content/tables/).
- Normal table: `.normal-table` (gray background for heading)
- Show the right line of each column, just use the class `.bd-right` together with class `.table`.
- Table results copied from Jupyter notebooks: paste directly. If you wanna add manually without using jupyter notebook, you have to add class `dataframe` to that table!
  - If the table is too long, you need to wrap this table by a `div` with class `table-wrapper`.
  - If you copy the side by side tables, remember to remove all `border="1"` in the copied html.

## Inset figures / images

### Beginning of each post:

~~~ liquid
{% raw %}{% assign img-url = '/img/post/ML' %}{% endraw %}
~~~

and then

~~~ html
{% raw %}![alternative]({{img-url}}/figure.png){% endraw %}
~~~

### Normal inserting (without any class):

~~~
![Describe](link/to/figures)
~~~

### Full width

Full 100% width (`.img-full-100` is the same):

~~~
{:.img-full-normal}
![Describe](link/to/figures)
~~~

Full but overflow outside the margin:

~~~
{:.img-full}
![Describe](link/to/figures)
~~~

Full but 50% width. We can use `30 to 100` (steps 5) for the percentages.

~~~
{:.img-full-50}
![Describe](link/to/figures)
~~~

### FLoat to left / right

Float to the right:

~~~
{:.img-right}
![Describe](link/to/figures)
~~~

Float to the left:

~~~
{:.img-left}
![Describe](link/to/figures)
~~~

### Jemoji

- Check the list of emotional icons [here](https://www.webfx.com/tools/emoji-cheat-sheet/).
- Using: `:chicken:` gives :chicken:.

{:.alert.alert-warning}
Sometimes, this function makes some unwanted errors on the [search page](/search). You can copy and paste directly the emojis from [this site](https://getemoji.com/).

### Side-by-side figure and content / columns

~~~ html
<div class="columns-2" markdown="1">
Texts

![alt](/link)
</div>
~~~

Default, two columns will be separated into 50-50. If you wanna other ratios, using below classes along with `.columns-2`:

- Ratio 2-1 or 1-2: `.size-2-1` or `.size-1-2`.
- Ratio 3-2 or 2-3: `.size-3-2` or `.size-2-3`.
- Ratio 1-1: `.size-1-1`.

{:.alert .alert-success}
You can also use `<div>` tag to enclose the section you wanna show in only 1 side. Note that you can also use default classes given in bootstrap such as `.pl-md-3` to add a separated space between 2 columns.

### Click to enlarge / zoom images

If you wanna some photos having the function "click to enlarge", just add class `.pop` (or `.zoom`) to this photo.

### Insert JSXGraph

You need to indicate it in the frontmatter: `jsxgraph: 1`. Below are an example. There are more other options, check [the docs](https://jsxgraph.org/wp/docs/index.html).

~~~ html
<div id="jsx-box" class="jxgbox" style="width:100%; height:250px;"></div>
<script type="text/javascript">
JXG.Options = JXG.merge(JXG.Options, {
    axis:{
      ticks:{
        majorHeight: 0,
        insertTicks: false, // show tick label
        ticksDistance : 6, // height of main ticks
      },
      lastArrow: {
          type: 1, // change the type
          highlightSize: 8, // ??
          size: 10 // size of last arrow
      },
    },
    text:{
      // fontSize: 16, // font-size of texts
      cssdefaultstyle: 'font-family: inherit; font-size: inherit;'
    },
    point:{
      face: 'x' // style of points
    },
    grid:{
      // visible: true, // didn't work??
      // set in the board's settings
      strokeColor: "pink" // grid's color
    }
 });
var brd1 = JXG.JSXGraph.initBoard('jsx-box', {
  axis:true,
  boundingbox: [-8, 5, 8, -4],
  grid: false, // display grid?
  showScreenshot: false, // show screen-shot (right lick to save image)?
  showNavigation: false, // show navigation?
  showCopyright: false // show copyright?
  }
);
var s = brd1.create('slider',[[1,4],[5,4],[1,10,50]],{name:'            n',snapWidth:1});
var a = brd1.create('slider',[[1,3],[5,3],[-10,-3,0]],{name:' start'});
var b = brd1.create('slider',[[1,2],[5,2],[0,2*Math.PI,10]],{name:' end'});
var f = function(x){ return Math.sin(x); };
var plot = brd1.create('functiongraph',[f,function(){return a.Value();}, function(){return b.Value();}]);

var os = brd1.create('riemannsum',[f,
  function(){ return s.Value();}, function(){ "left";},
  function(){return a.Value();},
  function(){return b.Value();}
  ],
  {
    fillColor:'#ffff00',
    fillOpacity: 0.3,
  }
);

brd1.create('text',[-6,-3,function(){ return 'Area = '+(JXG.Math.Numerics.riemannsum(f,s.Value(),"left".value,a.Value(),b.Value())).toFixed(4); }]);
</script>
~~~

which gives

<div id="jsx-box" class="jxgbox" style="width:100%; height:250px;"></div>
<script type="text/javascript">
JXG.Options = JXG.merge(JXG.Options, {
    axis:{
      ticks:{
        majorHeight: 0,
        insertTicks: false,
        ticksDistance : 6,
      },
      lastArrow: {
          type: 1,
          highlightSize: 8,
          size: 10
      },
    },
    text:{
      cssdefaultstyle: 'font-family: inherit; font-size: inherit;'
    },
    point:{
      face: 'x'
    },
    grid:{
      strokeColor: "pink"
    }
 });
var brd1 = JXG.JSXGraph.initBoard('jsx-box', {
  axis:true,
  boundingbox: [-8, 5, 8, -4],
  grid: false,
  showScreenshot: false,
  showNavigation: false,
  showCopyright: false
  }
);
var s = brd1.create('slider',[[1,4],[5,4],[1,10,50]],{name:'            n',snapWidth:1});
var a = brd1.create('slider',[[1,3],[5,3],[-10,-3,0]],{name:' start'});
var b = brd1.create('slider',[[1,2],[5,2],[0,2*Math.PI,10]],{name:' end'});
var f = function(x){ return Math.sin(x); };
var plot = brd1.create('functiongraph',[f,function(){return a.Value();}, function(){return b.Value();}]);

var os = brd1.create('riemannsum',[f,
  function(){ return s.Value();}, function(){ "left";},
  function(){return a.Value();},
  function(){return b.Value();}
  ],
  {
    fillColor:'#ffff00',
    fillOpacity: 0.3,
  }
);

brd1.create('text',[-6,-3,function(){ return 'Area = '+(JXG.Math.Numerics.riemannsum(f,s.Value(),"left".value,a.Value(),b.Value())).toFixed(4); }]);

</script>

❌ Don't use `//` for comment in the script, eliminate them or use `/* */` instead!!!

## Columns & Check box lists

Example like [this site](/to-be-done).

~~~ html
<div class="two-columns-list" markdown="1">
- [ ] Not finished task. There must be a space between "[" and "]"
- [x] Finished task.
</div>
~~~

Two equal sized columns,

~~~ html
<div class="d-md-flex" markdown="1">
<div class="flex-even overflow-auto pr-md-1" markdown="1">
Rest parameter (ES6)
// code
</div>
<div class="flex-even overflow-auto pl-md-1" markdown="1">
Spread Operator (ES6)
// code
</div>
</div>
~~~

## Insert codes

### Liquid code

- If you wanna add tag `{{"{% this "}}%}`, use `{% raw %}{{"{% this "}}%}{% endraw %}`.
- If you like this `{{"{{ this "}}}}`, use `{% raw %}{{"{{ this "}}}}{% endraw %}`.
- **The rule**: use `{% raw %}{{"{% endraw %}` before the key-word and end with `{% raw %}"}}{% endraw %}` before the end of key-word.
- **An easier way**: use `{{ "{% raw " }}%}` and `{{ "{% endraw " }}%}` around the key-word. These two commands are also used for a block of codes,

	~~~
  ~~~ {{ "{% raw " }}%}{% raw %}{% for %}
  // line of codes
  {% end for %}{% endraw %}{{ "{% endraw " }}%} ~~~
	~~~

	**Tips**: For a beautiful display, put `{{ "{% raw " }}%}` and `{{ "{% endraw " }}%}` exactly like the above code.

### Box of codes

- Gray: `{:.bg-gray}` before `~~~`.
- Output: `{:.output}` before `~~~`.

### Code with line numbers

There must be a language!:

~~~
{% raw %}{% highlight ruby linenos %}
// line of codes
{% endhighlight %}{% endraw %}
~~~

### Side-by-side code boxes

Depend on the length of codes, you decides to use `.d-md-flex` or `.d-lg-flex`.

#### Output with flexible widths

~~~ html
<div class="d-md-flex" markdown="1">
{:.flex-fill.d-flex.overflow-auto}
Other code blocks

{:.output.flex-fill.d-flex}
Result code blocks
</div>
~~~

#### Output with equal widths,

~~~ html
<div class="d-md-flex" markdown="1">
{:.flex-even.d-flex.overflow-auto}
Other code blocks

{:.output.flex-even.d-flex}
Result code blocks
</div>
~~~

#### With line numbers:

~~~ html
<div class="d-md-flex of-auto" markdown="1">
Block of codes with line numbers

{:.output.flex-fill.d-flex.overflow-auto}
Result code blocks
</div>
~~~

If you want 2 boxes share equal widths

~~~ html
<div class="d-md-flex" markdown="1">
{:.flex-even.overflow-auto.pr-md-1}
Block of codes.

{:.flex-even.overflow-auto.pl-md-1}
Block of codes.
</div>
~~~

#### Code with figure

``` html
<div class="columns-2" markdown="1">
# code block

{:.img-full-85}
![]()
</div>
```

#### Options

- Add `.overflow-auto` before the **result block** if its length is long.
- (Show line numbers case) Add `of-auto` like in above example if the **main code block** has a long length.
- (Hide line numbers case) Add `.overflow-auto` before the **main code block** if its length is long.
- If you want 2 boxes share equal widths, replace `.flex-fill.d-flex` with `.flex-even`!
- If two column stick together (with no space between them), you can use `.pr-md-1` for the left and `.pl-md-1` for the right.
- If you wanna the output box stick to the code box, use `.mt-m1.bt-none` class.

### Auto-equal 50% code boxes

~~~ html
<div class="flex-50" markdown="1">
code_block_1

code_block_2

code_block_3
</div>
~~~

## Insert boxes

### Box around formulas

~~~ html
<p class="p-mark">
Content
</p>
~~~

### Terminal box

~~~ html
{:.terminal}
$ sudo apt-get update
~~~

### Alert boxes by Bootstrap

Checkm all other types of alert boxes [here](https://getbootstrap.com/docs/4.1/components/alerts/){:target="_blank"}. Below are 3 of them (success--green, warning--yellow, danger--red). You have 3 ways to add an alert box in this site. Note that, you can use interchangeably between `warning`, `success` and `danger`.

If your alert box has only 1 paragraph,

~~~ html
{:.alert.alert-warning}
Content
~~~

If you wanna add a complicated block inside the box or there are more than 1 paragraph,

~~~ html
<div class="alert alert-warning" role="alert" markdown="1">
Content
</div>
~~~

You can use my self-defined tags (**Be careful:** if you run your site on Github Pages, it won't work!)

~~~
{% raw %}{% alertbox warning %}
Content
{% endalertbox %}{% endraw %}
~~~

<div class="alert alert-warning" role="alert" markdown="1">
If you wanna insert a block of math inside above boxes, don't foget to wrap them inside a p tag.
</div>

### Hide / Show boxes

For different boxes, use different `box1ct`!

~~~ html
<div class="hide-show-box">
<button type="button" markdown="1" class="btn collapsed box-button" data-toggle="collapse" data-target="#box1ct">
Box's title
</button>
<div id="box1ct" markdown="1" class="collapse multi-collapse box-content">
Box's content.
</div>
</div>
~~~

If you wanna show the box as default, add class `show"` to the `div#box1ct`.

:bulb: **Simpler method**{:.tbrown}: you can use below shortcode. **Be careful**: if you run your site on Github Pages, it won't work!

~~~
{% raw %}{% hsbox **Tựa đề box** | show %}
Box's content.
{% endhsbox %}{% endraw %}
~~~

If you don't wanna show the box as default, remove `| show`.

### Definition box

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

:bulb: **Simpler method**{:.tbrown}: you can use below shortcode. **Be careful**: if you run your site on Github Pages, it won't work!

~~~
{% raw %}{% defbox Title | boxid %}
Content
{% enddefbox %}{% endraw %}
~~~

Box's id `boxid` is optional and you can use markdown syntax for `Title`.

### A simple white box

Like the error box at the end of this post. You can also use class `simple-box`!

~~~ html
<div class="box-error">
Content
</div>
~~~

### Others

- Gray box of code : add class `{:.bg-gray}` before the code.

## Steps

<div class="columns-2" markdown="1">
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

<div class="pl-sm-3 pl-md-4">
which gives,

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
</div>

</div>

:bulb: **More convinient way**{:.tbrown}: Using below shortcode! **Be careful**: if you run your site on Github Pages, it won't work!

~~~
{% raw %}{% stepblock %}

{% eachstep %}
Content of step 1.
{% endeachstep %}

{% eachstep %}
Content of step 2.
{% endeachstep %}

{% endstepblock %}{% endraw %}
~~~


## Fonts & Texts

### Font-size

- `.font-90`: `90%`. You can use other numbers like `95, 80, 85`.

### Superscript references

If you wanna add something like that ({% ref http://math2it.com custom text %}), you can use

~~~
{% raw %}{% ref http://domain.com | custom text %}{% endraw %}
~~~

where `| custom text` is optional, defaut is `ref`.

### Given texts

This post is not complete:

~~~
{% raw %}{% notcomplete %}{% endraw %}
~~~

This post is updated frequently:

~~~
{% raw %}{% updfreq %}{% endraw %}
~~~

### Badges

~~~ html
<span class="tbadge badge-green">text</span>
<span class="tbadge badge-yellow">text</span>
<span class="tbadge badge-gray">text</span>
~~~

:bulb: **More convinient way**{:.tbrown}: Using below shortcode! **Be careful**: if you run your site on Github Pages, it won't work!

~~~
{% raw %}{% badge text | green %}
{% badge text | yellow %}
{% badge text | gray %}{% endraw %}
~~~

### References at the end of each post"

~~~ html
{:.ref}
Source of figures used in this post:
~~~

### Others

- Marked texts: `<mark>texts</mark>`
  - If you wanna use markdown synctax inside this mark tag, use `<mark markdown="span">texts</mark>`.
  - :bulb: **Easier way** (doesn't work on Github Pages): `{{"{% mark highlighted texts "}}%}`.
- Keyboard: `<kbd>B</kbd>` or `{{"{% kbd B "}}%}`
- Open in Colab: `{{"{% colab url "}}%}`.
- HTML file: `{{"{% html url "}}%}`.
- More link:
	~~~html{% raw %}
  {% include more.html content="[text](link)" %}
	{% endraw %}~~~
- Subject: `<sbj>Texts</sbj>`
- Target blank
  ~~~
  [alt](/link){:target="_blank"}
  ~~~
- For the series of posts
  ~~~
  {:.series}
  **For this series** : [part 1](/link), [part 2](/link).
  ~~~
- **Text colors**: using these classes `.tgreen`, `tgreen-light`, `.tpink`, `.tyellow`, `.tbrown`.
- `h2` with smaller font-size (subject): add class `.subject` before this `h2`.

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
  \begin{align}\tag{1}
  x^n + y^n = z^n
  \end{align}
  $$
	~~~

- You don't need an enviroment `align` or `equation` to use `\label`, you can use it with `$$` only, for example,

	~~~ latex
  $$
  x^n + y^n = z^n \tag{1}
  $$
	~~~


## Katex

- Must indicate `katex: 1` in the front matter.
- Inline: `{%raw%}{% katex %}{% endkatex %}{%endraw%}`.
- Display mode: `{%raw%}{% katex display %}{% endkatex %}{%endraw%}`.
  - You have to use `\begin{aligned}` instead of `\begin{align}` for aligned equations.
- Many inline formulas: wrap a paragraph with `{%raw%}{% katexmm %}{% endkatexmm %}{%endraw%}` and then use inside it,
  - `$..$` for inline.
  - `$$..$$` for display.
  - `\$` to escape `$` anywhere within the katexmm environment.
  - You don't have to use `\_` for `_`.
- Read more about [jekyll-katex](https://github.com/linjer/jekyll-katex).