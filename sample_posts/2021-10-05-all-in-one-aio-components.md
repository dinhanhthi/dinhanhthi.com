---
layout: post
title: "AIO components"
tags: [Others, Static Site Generators, 11ty, Project-based Learning, MOOC, Machine Learning, Data Science, Deep Learning, NLP, MLOps, Python, Angular, JavaScript, Skills]
toc: true
icon: "/img_src/header/aio.svg"
keywords: "AIO all in one components post types boxes hide show hide/show linke url insert images 11ty eleventy topics all topics subjects code blocks boxes math equations"
---

This note is used to show the compoents I created to use in this site. It's for me only. I use it as a reference when I wanna create some components for the notes.

👉 **Note:** [For me only](/for-me-only-copied/) (This is another technical note used for this site only).

## Inline components

- Highlight ==inline== texts.
- Keyboards like [[Ctrl]] + [[V]] or [[⌘]] + [[V]].
- Reference{% ref "https://dinhanhthi.com" %}.
- Inline {color:red}text{color} {color:blue}color{color}.
- Some emoji symbols with codes: :point_right:, :low_brightness:, :question:, :exclamation:, :vietnam: (check more [here](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/full.json))

## Headings

### Inside heading

::: hsbox Adjacent headings
# Heading H1

## Heading H2 (adjacent to H1){:data-toc-exclude}

### Heading H3 (adjacent to H2){:data-toc-exclude}

#### Heading H4 (adjacent to H3){:data-toc-exclude}
:::

::: hsbox Headings next to other components
## Heading with other components behind{:data-toc-exclude}

A paragraph

## Heading after other components{:data-toc-exclude}
:::

### Another inside heading

## Alert boxes

::: warning
The content with a [link inside](#)!
:::

::: success
The content with a [link inside](#)!
:::

<div class="info">
This one uses directly html markups.
</div>

::: danger
The content with a [link inside](#)!
:::

## Hide / Show boxes

::: hsbox **Title Name** without `""` and use markdown
Content
:::

{% hsbox 'Using **liquid tag** instead (Title with `""`)' %}
Note that, above we use `''` instead of `""` because inside the title, there is another `""`!
{% endhsbox %}

<div class="hsbox">
<div class="hs__title show">
Using **HTML tags** with ability of being showed by default
</div>
<div class="hs__content">

Yes! There is a blank line above! And we cannot use **markdown** inside the title when using HTML tag.

``` js
const func = () => {
  // content
}
```

<div class="hsbox">
<div class="hs__title">
{% markdown true %}But we can with **this one**!{% endmarkdown %}
</div>
<div class="hs__content">

Content
</div>
</div>

</div>
</div>

{% hsbox "Boxes inside a list" %}
- Item 1
- Item 2

  <div class="hsbox">
	<div class="hs__title">
		More detail
	</div>
	<div class="hs__content">

  ```js
  // codes
  ```
  </div>
  </div>

  - Sub item.
- Item
{% endhsbox %}
