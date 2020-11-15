var test = require('tape');

var md = require('markdown-it')();
var lazy_loading = require('./index.js');
md.use(lazy_loading);

test('lazy loading test', function (t) {
  t.plan(1);

  t.equal(
    md.render(`![](example.png "image title")`),
    '<p><img src="example.png" alt="" title="image title" loading="lazy"></p>\n'
  );
});

