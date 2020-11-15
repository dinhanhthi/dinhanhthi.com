# texmath-static [![Netlify Status](https://api.netlify.com/api/v1/badges/c187bcca-9464-4b2d-98d3-06982d8c1fe4/deploy-status)](https://app.netlify.com/sites/eloquent-goldstine-e9aa03/deploys)

*A static version for texmath.* -- __11ty version__.

- __Demo__: https://eloquent-goldstine-e9aa03.netlify.app
- **Tools**
  - [11ty](https://www.11ty.dev/)
  - [Nunjucks](https://mozilla.github.io/nunjucks/) (mozilla)
- **Starters**
  - [eleventy-base-blog](https://github.com/11ty/eleventy-base-blog)

## Build & run this theme

``` bash
# install nodejs
# https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions

npm install
# modify informations in _data/metadata.json
npm start
# localhost:8080/

# generate different sizes for images (from /img_src/ to /img/) + compress the images (in /img/)
npm run gulp
# or
npm install --global gulp-cli # to use "gulp" globally
npm install gulp # install locally
gulp build
# generate different sizes for images in /img_src/
gulp generateSizes
# compress images in /img/
gulp imgCompress
```

Setting up on Netlify

``` bash
npm run build
```

## TODO

Don't design, testing to create components first! Directly test or reference to a source.

- [x] All basic fotmat in markdown (heading, blockquote, list, bold, italic,...)
  - [x] Using html tags inside markdown doc -> [this](https://github.com/markdown-it/markdown-it#init-with-presets-and-options)
  - [ ] Custom containers -> [this](https://github.com/markdown-it/markdown-it-container)
    - [x] Warning blocks (eg. `::: warning` becomes `<div class="warning"></div>`) 
  - [x] Footnote -> [this](https://github.com/markdown-it/markdown-it-footnote)
  - [x] use `==text==` for rendering to `<mark>text</mark>` -> [this](https://github.com/markdown-it/markdown-it-mark)
  - [x] keyboard by `[[Ctrl]]` --> [this](https://www.npmjs.com/package/@gerhobbelt/markdown-it-kbd)
  - [x] Task list like github -> [this](https://www.npmjs.com/package/@hackmd/markdown-it-task-lists)
  - [x] Emoji? -> this
  - [x] FontAwesome support -> [this](https://www.npmjs.com/package/@gerhobbelt/markdown-it-fontawesome)
  - [ ] many [more](https://www.npmjs.com/search?q=keywords%3Amarkdown-it-plugin&page=2&perPage=20)
  
- [x] Table of contents (TOC) -> use [this plugin](https://www.npmjs.com/package/eleventy-plugin-toc) (for 11ty), and [this](https://www.npmjs.com/package/markdown-it-table-of-contents) (markdown-it, `[[toc]]`).

- [x] Hover heading links ->  `markdown-it-anchor`
  
  - use option `prefixHeadingsIds: false`
  
- [x] Excerpt for posts.

  - (need to use a separator like `<!-- more -->`) => not working!!!!
  - this [tut](https://www.jonathanyeong.com/posts/excerpts-with-eleventy/) (auto)

- [ ] Insert images
  - [x] Insert inside markdown file with custom folder. -> [this tut](https://jamesdoc.com/blog/2018/rwd-img-11ty/)
  - [x] Reponsive images ([read more](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)) + `markdown-it` -> plugin `@gerhobbelt/markdown-it-responsive` + generate images by gulp (`npm i gulp`) and gulp's plugin `gulp-responsive`.
    - [x] Watch the changes automatically using `gulp.watch()`
  - [x] Compress images at the same time with generate different sizes for images -> this [tut](https://www.freecodecamp.org/news/how-to-minify-images-with-gulp-gulp-imagemin-and-boost-your-sites-performance-6c226046e08e/)
  - [ ] Only generate + compress the newer images (don't perform on already-done ones)
    - [x] cache for compress -> using `gulp-cache` (not `gulp-cached`)
    - [ ] cache for generator sizes
  - [x] Lazy load images -> use [this](https://www.npmjs.com/package/markdown-it-image-lazy-loading)
    - `eleventy-plugin-lazyimages` doesn't work well with `markdown-it-responsive` -> don't use!!!
  - [x] Custom image size inside markdown, like `![](/link/img.png =200x200)` -> [this plugin](https://www.npmjs.com/package/markdown-it-imsize).
  - [ ] Inline image?
  - [ ] Auto numbering images -> Using CSS
  
- [ ] Insert custom javascript blocks (for example, reference-mode button)

- [x] Insert math equations (katex)
  - [x] [markdown-it-katex](https://github.com/waylonflinn/markdown-it-katex)
    - [x] Using updated version (12), currently 0.5.1. -> use [this](https://github.com/iktakahiro/markdown-it-katex/) instead!
    - **Or?** using katex directly in `<head>`
  - More advanced (using katex also) -> [here](https://www.npmjs.com/package/markdown-it-texmath)
  - **later** -- [markdown-it-mathjax](https://github.com/classeur/markdown-it-mathjax)
  
- [x] Insert syntax highlight for inline/block codes. -> [plugin](https://www.11ty.dev/docs/plugins/syntaxhighlight/) + [list of supported languages](https://prismjs.com/#languages-list)
  
  - [x] Why there is no space before block of code when using `js` without lines, i.e. `j/2-3`.
  
- [x] Custom class for blocks in markdown like `{:.class_name}`. -> try [this plugin](https://www.npmjs.com/package/markdown-it-attrs)? (it uses `{.class_name}` instead -> use [custom delimiters](https://www.npmjs.com/package/markdown-it-attrs#custom-delimiters)).
  
  - Check [this](https://github.com/11ty/eleventy/issues/697) also.
  - __Note__: need `markdown-it@11.0.1` (must be `<12.0.0`)
  
- [ ] Migrate from wordpress (less modification as possible)

- [x] Pagination

  - Posts -> [this](https://www.11ty.dev/docs/pagination/#paging-a-collection)

  - Others -> [this](https://www.11ty.dev/docs/pagination/)
  - Create link to the list of pages -> [this](https://www.11ty.dev/docs/pagination/nav/)

- [x] Navigation.

- [ ] Multi-users/authors -> [this](https://www.raymondcamden.com/2020/08/24/supporting-multiple-authors-in-an-eleventy-blog)

- [x] Embed Youtube videos based on its URL. -> check [this plugin](https://www.npmjs.com/package/eleventy-plugin-youtube-embed).

- [ ] SEO friendly?

- [ ] Keep links from Wordpress.

- [ ] Popular posts? Related posts?

- [ ] Search -> Using Google Custom Search

- [ ] Series of posts. -> using collections

- [ ] Comment system. -> using facebook comment system

- [ ] Upvote button. -> using facebook like or something else?

- [x] Tags

- [ ] Categories

- [ ] Custom urls (with/without `/posts/` or with/without days)

- [x] Previous / Next post

- [x] 404 page.

- [x] Bootstrap -> **don't use in texmath / dinhanhthi.com!**
  - [x] If wanna use, read [this note](https://dinhanhthi.com/11ty-nunjucks#bootstrap--11ty).
  - **optional** -- Separatedly components.
  - **optional** -- Using [Bootstrap native](https://thednp.github.io/bootstrap.native/).
  - [x] Remove bootstrap from test!
  
- [ ] Without bootstrap
  
  - [ ] Collapse with native JS -> [ref](https://medium.com/dailyjs/mimicking-bootstraps-collapse-with-vanilla-javascript-b3bb389040e7)
  
- [ ] Create a custom plugin in 11ty -> check [Creating an 11ty Plugin - SVG Embed Tool - bryanlrobinson.com](https://bryanlrobinson.com/blog/creating-11ty-plugin-embed-svg-contents/)

## References

- [Official docs](https://www.11ty.dev/docs/).
- [Moving from WordPress to Eleventy](https://www.mattnortham.com/blog/2020/moving-from-wordpress-to-eleventy/#handling-images)

## Cheat sheet

Read [this note](https://dinhanhthi.com/11ty-nunjucks).