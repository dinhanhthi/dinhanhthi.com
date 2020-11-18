# dinhanhthi.com in 11ty [![Netlify Status](https://api.netlify.com/api/v1/badges/19c8cf98-727e-4c9f-85cc-f8ea98133896/deploy-status)](https://app.netlify.com/sites/nostalgic-williams-c413ff/deploys)

📌 __Source__: https://github.com/google/eleventy-high-performance-blog <br />
⭐ __Demo__: https://new.dinhanhthi.com/ <br />
🚀 __Performance__: [Google Insight](https://developers.google.com/speed/pagespeed/insights/?url=https%3A%2F%2Fnew.dinhanhthi.com). <br />
📚 __Dev notes__: [./DEV_NOTE.md](./DEV_NOTE.md)


## TODO

- [x] SCSS to CSS using rollup.
  - [x] Rollup watch with sass' components.
- [x] URL without trailing slashes `/`? -> keep it!
- [x] Categories? -> use tags as cats! -> __each post has only 1 tag__! (in the case changing idea, read [this post](https://www.webstoemp.com/blog/basic-custom-taxonomies-with-eleventy/))
  - [This post](https://www.pborenstein.com/posts/collections/) is also interesting.
- [x] Custom frontmatter keys
- [ ] Tags
  - [ ] List tags in own way
  - [ ] Tag with custom icon
- [x] Chane font! -> use [this tool](http://google-webfonts-helper.herokuapp.com/fonts/open-sans?subsets=latin) to generate woff2/woff fonts. -> use [Poppins font](https://fonts.google.com/specimen/Poppins).
- [ ] Header
  - [x] NAV
    - [x] color like old dat.com
    - [x] search box inside nav -> bat chuoc dat.com but full width!
    - [x] Change reading process fullfill to underline
  - [x] ~~Search box like [this page](https://instructor-support.datacamp.com/en/).~~
- [ ] Flexbox index!
  - [x] List of tags
  - [x] List of posts 
- [ ] Responsible
  - [x] Grid point defined in `main.scss`.
- [x] USing color based on [dracular](https://github.com/dracula/dracula-theme).
- [ ] Theme based on [notion's style](https://www.notion.so/Help-Support-e040febf70a94950b8620e6f00005004).
- [x] Always [check performance](https://developers.google.com/speed/pagespeed/insights/).

## Build

``` bash
# install nodejs
# https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions

npm install

# build + watch
npm run thi

# Build, serve, watch and test
npm run watch

# build and test
npm run build

# localhost:8080/

# Setting up on Netlify
npm run build
```