const Toc = require('./toc');


module.exports = {
    initArguments: {},
    configFunction: function (eleventyConfig, options = {}) {

        eleventyConfig.addFilter('toc', (content, opts) => {
            const toc = new Toc(content, {...options, ...opts});
            return toc.html();
        })
    }
};
