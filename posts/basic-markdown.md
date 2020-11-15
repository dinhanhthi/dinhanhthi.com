---
title: Basic markdown components
description: This post is used for testing the render of default markdown blocks
date: 2020-09-11
tags:
  - default
categories: main
layout: layouts/post.njk
---

**Normal paragraph.** Capitalize on low hanging fruit to identify a ballpark value added activity to beta test. Override the digital divide with additional clickthroughs from DevOps. Nanotechnology immersion along the _information highway will close the loop on focusing solely on the bottom line_.

## TOC?

``` js
[[toc]]
```

[[toc]]

## Headings H2

### Heading H3

#### Heading H4

## Emoji?

``` js
:imp: :innocent: :point_up:
```

:imp: :innocent: :point_up:

Check more [here](https://www.webfx.com/tools/emoji-cheat-sheet/).

## HTML block inside markdown?

> This is a blockquote generated from markdown-it


<blockquote>
<p>This is a blockquote from input html element</p>
</blockquote>

## Mark

``` js
Doan nay rat dai ==danh dau== khong can danh dau.
```

Doan nay rat dai ==danh dau== khong can danh dau.

## Keyboard

``` js
Using this [[Ctrl]] + [[Shift]] + [[L]]
```

Using this [[Ctrl]] + [[Shift]] + [[L]]

## List

1. abc
2. xyz
   1. 123
   2. 456
3. dfg
   - adasd asdasd
   - da dassd asdasd

- dasda as
- dasdasasdasdsd
  1. adsasd
  2. sadasd asd asd
- dasdqwdas asdas ds

### Task list

- [ ] Task 1
- [x] Task 2
- [x] Task 3
- [ ] Task 4

1. [ ] task
2. [x] task

## Footnote

Here is a footnote reference,[^1] and another.[^longnote]

[^1]: Here is the footnote.

[^longnote]: Here's one with multiple blocks.
    Subsequent paragraphs are indented to show that they
belong to the previous footnote.

## Math

$$
\dfrac{1}{2}
$$

## Table

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

## Warning blocks

``` js
::: success
This is a success message.
:::
```

::: success
This is a success message.
:::

``` js
::: info
This is a info message.
:::
```

::: info
This is a info message.
:::

``` js
::: warning
This is a warning message.
:::
```

::: warning
This is a warning message.
:::

``` js
::: danger
This is a danger message.
:::
```

::: danger
This is a danger message.
:::

## Custom class `{:.class_name}` (like in Jekyll)

``` js
Test custom class with __red text__{:.text-red} to see the change in color :D
```

Test custom class with __red text__{:.text-red} to see the change in color :D

## Youtube video

``` js
@[youtube](dQw4w9WgXcQ)
```

@[youtube](ZqjhmdRgXMw)

``` js
@[youtube](https://www.youtube.com/watch?v=ZqjhmdRgXMw)
```

@[youtube](https://www.youtube.com/watch?v=ZqjhmdRgXMw)