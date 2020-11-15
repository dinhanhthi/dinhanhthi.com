'use strict';

var path = require('path');
var assert = require('assert');
var should = require('should');
var generate = require('@gerhobbelt/markdown-it-testgen');
var markdown = require('@gerhobbelt/markdown-it');

describe('markdown-it-responsive', function() {
  var option = { responsive: {
    'srcset': {
      'header-*': [ {
        width: 320,
        rename: {
          suffix: '-small'
        }
      }, {
        width: 640,
        rename: {
          suffix: '-medium'
        }
      } ]
    },
    'sizes': {
      'header-*': '(min-width: 36em) 33.3vw, 100vw'
    }
  } };

  var md = markdown({
    html: true,
    linkify: true,
    typography: true
  }).use(require('../lib'), option);
  generate(path.join(__dirname, 'fixtures/markdown-it-responsive/responsive.txt'), md);

});

describe('markdown-it-responsive-picturefill', function() {

  var option = { responsive: {
    'srcset': {
      'header-*': [ {
        width: 320,
        rename: {
          suffix: '-small'
        }
      }, {
        width: 640,
        rename: {
          suffix: '-medium'
        }
      } ]
    },
    'sizes': {
      'header-*': '(min-width: 36em) 33.3vw, 100vw'
    },
    removeSrc: true
  } };
  var md = markdown({
    html: true,
    linkify: true,
    typography: true
  }).use(require('../lib'), option);
  generate(path.join(__dirname, 'fixtures/markdown-it-responsive/responsive-picturefill.txt'), md);
});

describe('markdown-it-responsive-path-rewrite', function() {

  var option = { responsive: {
    'srcset': {
      'header-*': [ {
        width: 320,
        rename: {
          suffix: '-small',
          path: 'newdir/small'
        }
      }, {
        width: 640,
        rename: {
          suffix: '-medium',
          path: 'newdir/medium'
        }
      } ]
    },
    'sizes': {
      'header-*': '(min-width: 36em) 33.3vw, 100vw'
    }
  } };
  var md = markdown({
    html: true,
    linkify: true,
    typography: true
  }).use(require('../lib'), option);
  generate(path.join(__dirname, 'fixtures/markdown-it-responsive/responsive-path-rewrite.txt'), md);
});

describe('Invalid operations', function() {
  it('No option', function() {
    (function() {
      var md = markdown({
        html: true,
        linkify: true,
        typography: true
      }).use(require('../lib'));
    }).should.throw();
  });

  it('No responsive field', function() {
    (function() {
      var md = markdown({
        html: true,
        linkify: true,
        typography: true
      }).use(require('../lib', { autofill: true }));
    }).should.throw();
  });
});

describe('Wildcard to RegExp converter', function() {
  var wc2reg = require('../lib/wildcardToRegex.js');

  it('Convert start (*)', function() {
    assert.deepEqual(wc2reg('test-*.png'), /test\-([\s\S]+?)\.png/);
  });

  it('Convert question mark (?)', function() {
    assert.deepEqual(wc2reg('test-??.png'), /test\-(.)(.)\.png/);
  });
});
