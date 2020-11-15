'use strict';

var debug = require('debug')('rename');
var parse = require('./lib/parse');
var stringify = require('./lib/stringify');
var util = require('./lib/util');

module.exports = rename;
module.exports.parse = parse;
module.exports.stringify = stringify;

/*
  Rename filepath using transformer
*/
function rename(filepath, transformer) {
  var result;
  /*
    Return a file object

    {
      dirname
      basename
      extname
      origin
    }
  */
  var fileObj = parse(filepath);

  if (!transformer) {
    result = stringify(fileObj);
    debug('transform to %s with no transformer', result);
    return result;
  }

  /*
    transformed object

    {
      dirname
      prefix
      basename
      suffix
      extname
    }
  */
  var transformed = util.isFunction(transformer) ? transformer(fileObj) : transformer;

  // rename it when transformer is string as a filepath
  if (util.isString(transformed)) {
    result = transformed || stringify(fileObj);
    debug('transform from %j to `%s` with %j', fileObj, result, transformed);
    return result;
  }

  if (!util.isObject(transformed)) {
    throw new Error('transformer should be string, function or object.');
  }

  result = transform(fileObj, transformed);
  debug('transform from %j to `%s` with %j', fileObj, result, transformed);
  return result;
}

function transform(fileObj, transformed) {
  transformed = parseTemplate(transformed, fileObj);
  var result = {};
  result.dirname = choose('dirname', transformed, fileObj);
  result.extname = choose('extname', transformed, fileObj);
  result.basename = [
    transformed.prefix || '',
    choose('basename', transformed, fileObj),
    transformed.suffix || '',
  ].join('');
  return stringify(result);
}

function choose(name, changed, origin) {
  return name in changed ? (changed[name] || '') : origin[name];
}

// parse template like ${xxx} in transformed using file object
var RE_REPLACE = /\$\{?([a-zA-Z0-9-_]*)\}?/g;
function parseTemplate(transformed, fileObj) {
  var result = {};
  Object.keys(transformed).forEach(function(key) {
    result[key] = !transformed[key] ?
      transformed[key] :
      transformed[key].replace(RE_REPLACE, function(_, matched) {
        return fileObj[matched] || '';
      });
  });
  return result;
}
