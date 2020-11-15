const { DateTime } = require("luxon");
const fs = require("fs");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginNavigation = require("@11ty/eleventy-navigation");
const striptags = require("striptags");

// markdown-it's extensions
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItResponsive = require('@gerhobbelt/markdown-it-responsive');
var markdownItAttrs = require('markdown-it-attrs');



module.exports = function (eleventyConfig) {
    eleventyConfig.addShortcode("excerpt", (article) => extractExcerpt(article));

    eleventyConfig.addPlugin(pluginRss);
    eleventyConfig.addPlugin(pluginSyntaxHighlight);
    eleventyConfig.addPlugin(pluginNavigation);

    eleventyConfig.setDataDeepMerge(true);

    // layour alias
    eleventyConfig.addLayoutAlias("post", "layouts/post.njk");

    eleventyConfig.addFilter("readableDate", dateObj => {
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat("dd LLL yyyy");
    });

    // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
    eleventyConfig.addFilter('htmlDateString', (dateObj) => {
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
    });

    // Get the first `n` elements of a collection.
    eleventyConfig.addFilter("head", (array, n) => {
        if (n < 0) {
            return array.slice(n);
        }

        return array.slice(0, n);
    });

    eleventyConfig.addCollection("tagList", function (collection) {
        let tagSet = new Set();
        collection.getAll().forEach(function (item) {
            if ("tags" in item.data) {
                let tags = item.data.tags;

                tags = tags.filter(function (item) {
                    switch (item) {
                        // this list should match the `filter` list in tags.njk
                        case "all":
                        case "nav":
                        case "post":
                        case "posts":
                            return false;
                    }

                    return true;
                });

                for (const tag of tags) {
                    tagSet.add(tag);
                }
            }
        });

        // returning an array in addCollection works in Eleventy 0.5.3
        return [...tagSet];
    });

    // Copy `img/` to `_site/img`
    eleventyConfig.addPassthroughCopy("img");

    /* Markdown Overrides */
    let options = {
        html: true,
        breaks: true,
        linkify: true,
    };

    // responsible images
    eleventyConfig.addFilter("imgSuffix", (imgStr, suffix) => {
        const i = imgStr.lastIndexOf('.');
        const imgPath = imgStr.substring(0, i);
        const ext = imgStr.substring(i + 1);
        return `${imgPath}-${suffix}.${ext}`;
    });
    const rwdOptions = {
        responsive: {
            'srcset': {
                '*': [{
                    width: 320,
                    rename: {
                        suffix: '-320'
                    }
                }, {
                    width: 550,
                    rename: {
                        suffix: '-550'
                    }
                }]
            },
            'sizes': {
                '*': '(max-width: 550px) calc(100vw - 120px), 550px'
            }
        }
    };

    // containers (markdown-it-container)
    // const warningOpt = {
    //     render: function (tokens, idx){

    //     }
    // }

    // anchor
    let markdownLibrary = markdownIt(options)
        .use(markdownItAnchor, {
            permalink: true,
            permalinkClass: "direct-link",
            permalinkSymbol: "#"
        })
        .use(markdownItResponsive, rwdOptions)
        .use(require('markdown-it-image-lazy-loading')) // lazy load
        .use(require('@iktakahiro/markdown-it-katex')) // katex
        .use(require('markdown-it-imsize')) // custom im size
        .use(require("markdown-it-emoji")) // emoji
        .use(require('markdown-it-mark')) // ==mark==
        .use(require("markdown-it-task-lists"))
        .use(require("markdown-it-table-of-contents"))
        .use(require('markdown-it-footnote'))
        .use(require('markdown-it-container'), 'success')
        .use(require('markdown-it-container'), 'info')
        .use(require('markdown-it-container'), 'warning')
        .use(require('markdown-it-container'), 'danger')
        .use(markdownItAttrs, {
            leftDelimiter: '{:',
            rightDelimiter: '}'
        })
        .use(require('markdown-it-video', {
            youtube: { width: 640, height: 390 }
        }))
        .use(require('markdown-it-kbd')); // [[Ctrl]]

    eleventyConfig.setLibrary("md", markdownLibrary);

    // Browsersync Overrides
    eleventyConfig.setBrowserSyncConfig({
        callbacks: {
            ready: function (err, browserSync) {
                const content_404 = fs.readFileSync('_site/404.html');

                browserSync.addMiddleware("*", (req, res) => {
                    // Provides the 404 content without redirect.
                    res.write(content_404);
                    res.end();
                });
            },
        },
        ui: false,
        ghostMode: false
    });

    return {
        templateFormats: [
            "md",
            "njk",
            "html",
            "liquid"
        ],

        // If your site lives in a different subdirectory, change this.
        // Leading or trailing slashes are all normalized away, so don’t worry about those.

        // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
        // This is only used for link URLs (it does not affect your file structure)
        // Best paired with the `url` filter: https://www.11ty.dev/docs/filters/url/

        // You can also pass this in on the command line using `--pathprefix`
        // pathPrefix: "/",

        markdownTemplateEngine: "liquid",
        htmlTemplateEngine: "njk",
        dataTemplateEngine: "njk",

        // These are all optional, defaults are shown:
        dir: {
            input: ".",
            includes: "_includes",
            data: "_data",
            output: "_site"
        }
    };
};

function extractExcerpt(article) {
    if (!article.hasOwnProperty("templateContent")) {
        console.warn(
            'Failed to extract excerpt: Document has no property "templateContent".'
        );
        return null;
    }

    let excerpt = null;
    const content = article.templateContent;

    excerpt = striptags(content)
        .substring(0, 200) // Cap at 200 characters
        .replace(/^\s+|\s+$|\s+(?=\s)/g, "")
        .trim()
        .concat("...");

    return excerpt;
}