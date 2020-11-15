A markdown-it plugin supporting Chrome 75's [native image lazy-loading](https://addyosmani.com/blog/lazy-loading/).

## Install

```bash
$ npm install markdown-it-image-lazy-loading
```

## Usage

```javascript
const md = require('markdown-it')();
const lazy_loading = require('markdown-it-image-lazy-loading');
md.use(lazy_loading);

md.render(`![](example.png "image title")`);
// <p><img src="example.png" alt="" title="image title" loading="lazy"></p>\n
```

## License

MIT
