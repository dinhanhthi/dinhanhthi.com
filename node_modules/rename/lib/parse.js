'use strict';

var assert = require('assert');
var debug = require('debug')('rename:parse');
var extname = require('path').extname;
var dirname = require('path').dirname;
var basename = require('path').basename;
var util = require('./util');

module.exports = function parse(path) {
  assert(util.isString(path) || util.isObject(path),
    'Argument should be string or object.');

  var orig = path;

  if (util.isString(path)) {
    path = toObject(path);
  } else {
    path.dirname = path.dirname || '';
    path.extname = path.extname || '';
    path.basename = path.basename || '';
    path.origin = path.origin || '';
  }

  debug('parse from %j to %j', orig, path);
  return path;
};

function toObject(path) {
  var ext = extname(path);
  return {
    dirname: dirname(path),
    basename: basename(path, ext),
    extname: ext,
    origin: path,
  };
}
