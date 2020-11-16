# dinhanhthi.com in 11ty [![Netlify Status](https://api.netlify.com/api/v1/badges/19c8cf98-727e-4c9f-85cc-f8ea98133896/deploy-status)](https://app.netlify.com/sites/nostalgic-williams-c413ff/deploys)

📌 __Source__: https://github.com/google/eleventy-high-performance-blog <br />
⭐ __Demo__: https://new.dinhanhthi.com/ <br />
🚀 __Performance__: [Google Insight](https://developers.google.com/speed/pagespeed/insights/?url=https%3A%2F%2Fnew.dinhanhthi.com). <br />
📚 __Dev notes__: [./DEV_NOTE.md](./DEV_NOTE.md)


## TODO

- [x] SCSS to CSS using rollup.
- [ ] USing color based on [dracular](https://github.com/dracula/dracula-theme).
- [ ] Theme based on [notion's style](https://www.notion.so/Help-Support-e040febf70a94950b8620e6f00005004).
- [ ] Always [check performance](https://developers.google.com/speed/pagespeed/insights/).

## Build

``` bash
# install nodejs
# https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions

npm install

# Build, serve, watch and test
npm watch

# build and test
npm run build

# localhost:8080/

# Setting up on Netlify
npm run build
```