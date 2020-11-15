# rename

Rename files using some transformers.

---

[![NPM version](https://img.shields.io/npm/v/rename.svg?style=flat)](https://npmjs.org/package/rename)
[![Build Status](https://img.shields.io/travis/popomore/rename.svg?style=flat)](https://travis-ci.org/popomore/rename)
[![Build Status](https://img.shields.io/coveralls/popomore/rename.svg?style=flat)](https://coveralls.io/r/popomore/rename)
[![NPM downloads](http://img.shields.io/npm/dm/rename.svg?style=flat)](https://npmjs.org/package/rename)

**NOTE: Rename < 0.2.0 is not the same lib, you can see [renamer](https://www.npmjs.org/package/renamer). 1.0.0 have a big change.**

## Install

```
$ npm install rename -g
```

## Usage

Rename file using another filepath.

```js
rename('a.js', 'b.js');
// => b.js
```

Rename file using a _transform object_ that contain some property.

```
{
  dirname: "replace dirname",
  prefix: "add prefix before basename",
  basename: "replace dirname",
  suffix: "add prefix after basename",
  extname: "replace extname"
}
```

Add `-debug` suffix

```js
rename('a.js', {suffix: '-debug'});
// => a-debug.js
```

Also can use a _transform function_ that could return a _transform object_.

```js
rename('a.js', function() {
  return {suffix: '-debug'};
});
// => a-debug.js
```

## API

### rename(filepath, transformer)

#### filepath

Filepath can be a string or object. Parse the filepath to _file object_ if it's a string.

_File object_ should contain property dirname, basename and extname.

```js
rename({
  basename: 'a',
  extname: '.js'
}, 'b.js');
// => b.js
```

#### transformer

Transformer can be a function, string or object.

Simple example about _transform function_ using custom property.

```js
function transformer(fileObj) {
  return {
    suffix: fileObj.hash || '-debug'
  };
}

rename({
  basename: 'a',
  extname: '.js'
}, transformer);
// => a-debug.js

rename({
  basename: 'a',
  extname: '.js',
  hash: '-123'
}, transformer);
// => a-123.js
```

The value of _transform object_ can be template that parsed from _file object_.

```
rename({
  basename: 'c',
  extname: '.js',
  hash: '111'
}, {
  suffix: '-${hash}',
}).should.eql('c-111.js');
```

### rename.parse

Generate a _file object_ from a string or object.

### rename.stringify

Generate a filepath from _file object_.

## LISENCE

Copyright (c) 2017 popomore. Licensed under the MIT license.

