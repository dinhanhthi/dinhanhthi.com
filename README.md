# dinhanhthi.com in 11ty [![Netlify Status](https://api.netlify.com/api/v1/badges/19c8cf98-727e-4c9f-85cc-f8ea98133896/deploy-status)](https://app.netlify.com/sites/nostalgic-williams-c413ff/deploys)

📌 __Source__: https://github.com/google/eleventy-high-performance-blog <br />
⭐ __Demo__: https://new.dinhanhthi.com/ <br />
🚀 __Performance__: [Google Insight](https://developers.google.com/speed/pagespeed/insights/?url=https%3A%2F%2Fnew.dinhanhthi.com). <br />
📚 __Dev notes__: [./DEV_NOTE.md](./DEV_NOTE.md)


## Build

``` bash
# install nodejs
# https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions

npm install

# build + watch + test (locally + WITHOUT performing tasks on images)
npm run local

# build + watch + test (locally + WITH performing tasks on images)
npm run watch

# build and test
npm run build

# localhost:8080/

# Setting up on Netlify
npm run build
```

## Dev locally

1. Build on local using `.eleventy.dev.js`. The only difference between `.eleventy.dev.js` and `.eleventy.main.js` is the line of

    ``` js
    eleventyConfig.addPlugin(require("./_11ty/img-dim.js"));
    ```
2. Add theses folder to `.eleventyignore` (not build when composing new notes)

    ``` bash
    posts/algorithms/
    posts/data-science/
    posts/deep-learning/
    posts/deploy-run/
    posts/js/
    posts/ml/
    posts/mooc/
    posts/others/
    #posts/project/     # <- using "#" at folder containing the
                        #    currently-editing note
    posts/python/
    posts/r/
    posts/skills/
    posts/stats/
    posts/time-series/
    posts/web-dev/
    ```