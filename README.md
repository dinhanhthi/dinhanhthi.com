# dinhanhthi.com in 11ty [![Netlify Status](https://api.netlify.com/api/v1/badges/ae2637e4-f348-4ba4-9ed2-eaf31e941aa3/deploy-status)](https://app.netlify.com/sites/relaxed-newton-80720e/deploys)

__Demo__ (WIP): https://beta.dinhanhthi.com/


## TODO

- [ ] Basic layout.
  - [ ] NAV
  - [ ] Note
  - [ ] Index

## Build

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