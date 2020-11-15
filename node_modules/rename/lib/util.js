'use strict';

var toString = Object.prototype.toString;

exports.isString = function isString(arg) {
  return toString.call(arg) === '[object String]';
};

exports.isObject = function isObject(arg) {
  return toString.call(arg) === '[object Object]';
};

exports.isFunction = function isFunction(arg) {
  return toString.call(arg) === '[object Function]';
};
