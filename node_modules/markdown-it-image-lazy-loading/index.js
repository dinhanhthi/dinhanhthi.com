'use strict';

module.exports = function lazy_loading_plugin(md, options) {
  var defaultImageRenderer = md.renderer.rules.image;

  md.renderer.rules.image = function (tokens, idx, options, env, self) {
    var token = tokens[idx];
    token.attrSet('loading', 'lazy');
    return defaultImageRenderer(tokens, idx, options, env, self);
  };
};
