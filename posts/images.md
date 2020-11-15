---
title: Insert images
description: Testing everything about inserting images
date: 2020-10-29
tags: [default, code]
layout: layouts/post.njk
---

Thu nghiem **xem the nao**, xem no co [abc](/home), _asdasd_.

## Insert normally

Try to inset an image from `/img/` (normally, without any effect):

``` js
![Nancy](/img/doremon.jpg)
// image is store in /img/
```

![Nancy](/img/doremon.jpg)

## Custom sizes

Custom im size inside markdown?

``` js
![test](/img/doremon.jpg =100x300)
```

![test](/img/doremon.jpg =100x300)

Auto height?

``` js
![test](/img/doremon.jpg =100x)
```

![test](/img/doremon.jpg =100x)

Auto width?

``` js
![test](/img/doremon.jpg =x300)
```

![test](/img/doremon.jpg =x300)

## Try lazy load

Below image is very heavy!

![Very weight image](/img/hard_img.jpg)

## References

- [James Doc - Responsive images in Eleventy](https://jamesdoc.com/blog/2018/rwd-img-11ty/)
