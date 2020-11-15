'use strict';

var assert = require('assert');
var debug = require('debug')('stringify');
var join = require('path').join;
var isObject = require('./util').isObject;

module.exports = function stringify(obj) {
  assert(isObject(obj), 'Argument should be object.');

  obj.dirname = obj.dirname || '.';
  obj.extname = obj.extname || '';
  obj.basename = obj.basename || '';


  var path = join(obj.dirname, obj.basename + obj.extname);
  if (path === '.') {
    path = '';
  }
  debug('stringify to %s', path);
  return path;
};
