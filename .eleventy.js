const { DateTime } = require("luxon");
const { promisify } = require("util");
const fs = require("fs");
const hasha = require("hasha");
const readFile = promisify(fs.readFile);
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const elasticlunr = require("elasticlunr");
const { minify } = require("terser");
const _ = require("lodash");

const markdownIt = require("markdown-it");
var markdownItp = require("markdown-it")();
const mdItContainer = require("markdown-it-container");
const tm = require("./third_party/markdown-it-texmath"); // copied from github:dinhanhthi/markdown-it-texmath
const anchor = require("markdown-it-anchor");

const localImages = require("./third_party/eleventy-plugin-local-images/.eleventy.js");
const CleanCSS = require("clean-css");

const thiDataDir = "notes/_data";
var dataDir = thiDataDir;
var distPath;

const categories = require("./" + thiDataDir + "/categories.json");
const postAttributes = require("./" + thiDataDir + "/post_attributes.json"); // custom post attributes
const waveColors = require("./src/_data/wave_colors");
const { get } = require("lodash");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(require("eleventy-plugin-emoji"));

  eleventyConfig.addPlugin(
    require("./third_party/eleventy-plugin-nesting-toc"),
    {
      tags: ["h2", "h3"],
      wrapper: "div",
      wrapperClass: "toc toc-common toc-js",
      headingText: "On this page",
      headingTag: "div",
    }
  );

  eleventyConfig.addNunjucksAsyncFilter(
    "jsmin",
    async function (code, callback) {
      try {
        const minified = await minify(code);
        callback(null, minified.code);
      } catch (err) {
        console.error("Terser error: ", err);
        callback(null, code);
      }
    }
  );

  switch (process.env.ELEVENTY_ENV) {
    case "theming":
      distPath = "_built";
      eleventyConfig.addPlugin(require("./src/_11ty/optimize-html.js"), {
        distPath: distPath,
        devMode: true,
      });
      eleventyConfig.setDataDeepMerge(true);
      eleventyConfig.ignores.delete("sample_posts");
      eleventyConfig.ignores.add("notes/posts");
      eleventyConfig.ignores.delete("notes/blog");
      eleventyConfig.ignores.delete("notes/blog_wip");
      eleventyConfig.ignores.delete("notes/posts_wip");
      eleventyConfig.ignores.delete("notes/fixed_notes");
      eleventyConfig.ignores.add("notes/low-quality-posts");
      break;

    case "full-no-opt":
      distPath = "_built";
      eleventyConfig.addPlugin(require("./src/_11ty/optimize-html.js"), {
        distPath: distPath,
        devMode: true,
      });
      eleventyConfig.setDataDeepMerge(true);
      eleventyConfig.ignores.add("sample_posts");
      eleventyConfig.ignores.delete("notes/posts");
      eleventyConfig.ignores.delete("notes/blog");
      eleventyConfig.ignores.add("notes/blog_wip");
      eleventyConfig.ignores.add("notes/posts_wip");
      eleventyConfig.ignores.delete("notes/low-quality-posts");
      eleventyConfig.ignores.delete("notes/fixed_notes");
      break;

    case "netlify": // Used for building on Netlify (not used now)
      distPath = "_site";
      eleventyConfig.addPlugin(require("./src/_11ty/json-ld.js"));
      eleventyConfig.addPlugin(require("./src/_11ty/apply-csp.js"));
      eleventyConfig.addPlugin(require("./src/_11ty/optimize-html.js"));
      eleventyConfig.setDataDeepMerge(true);
      eleventyConfig.ignores.delete("notes/posts");
      eleventyConfig.ignores.delete("notes/blog");
      eleventyConfig.ignores.delete("notes/fixed_notes");
      eleventyConfig.ignores.add("sample_posts");
      eleventyConfig.ignores.add("notes/blog_wip");
      eleventyConfig.ignores.add("notes/posts_wip");
      eleventyConfig.ignores.add("notes/low-quality-posts");
      // notesData
      eleventyConfig.ignores.add("notesData");
      eleventyConfig.addPlugin(localImages, {
        distPath: distPath,
        assetPath: "/img/remote",
        selector:
          "img,amp-img,amp-video,meta[property='og:image'],meta[name='twitter:image'],amp-story",
        verbose: false,
      });

    default: // used to build locally before deploying
      distPath = "_site";
      eleventyConfig.addPlugin(require("./src/_11ty/json-ld.js"));
      eleventyConfig.addPlugin(require("./src/_11ty/apply-csp.js"));
      eleventyConfig.addPlugin(require("./src/_11ty/optimize-html.js"));
      eleventyConfig.setDataDeepMerge(true);
      eleventyConfig.ignores.delete("notes/posts");
      eleventyConfig.ignores.delete("notes/blog");
      eleventyConfig.ignores.delete("notes/fixed_notes");
      eleventyConfig.ignores.add("sample_posts");
      eleventyConfig.ignores.add("notes/blog_wip");
      eleventyConfig.ignores.add("notes/posts_wip");
      eleventyConfig.ignores.add("notes/low-quality-posts");
      eleventyConfig.addPlugin(localImages, {
        distPath: distPath,
        assetPath: "/img/remote",
        selector:
          "img,amp-img,amp-video,meta[property='og:image'],meta[name='twitter:image'],amp-story",
        verbose: false,
      });
  }

  eleventyConfig.addLayoutAlias("base", "layouts/base.njk");
  eleventyConfig.addLayoutAlias("page", "layouts/page.njk");
  eleventyConfig.addLayoutAlias("post", "layouts/post.njk");
  eleventyConfig.addLayoutAlias("blog", "layouts/blog.njk");

  eleventyConfig.addNunjucksAsyncFilter(
    "addHash",
    function (absolutePath, callback) {
      readFile(`${distPath}${absolutePath}`, {
        encoding: "utf-8",
      })
        .then((content) => {
          return hasha.async(content);
        })
        .then((hash) => {
          callback(null, `${absolutePath}?hash=${hash.substr(0, 10)}`);
        })
        .catch((error) => callback(error));
    }
  );

  eleventyConfig.addFilter("encodeURIComponent", function (str) {
    return encodeURIComponent(str);
  });

  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    );
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("dd-LL-yyyy");
  });

  // Compute duration from date
  eleventyConfig.addFilter("toDuration", (inputDateObj) => {
    const dateObj =
      typeof inputDateObj === "string" ? new Date(inputDateObj) : inputDateObj;
    const durationInDays =
      (new Date().getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24);
    if (durationInDays < 1) {
      return "today";
    } else if (durationInDays < 2) {
      return "yesterday";
    } else if (durationInDays < 30) {
      return Math.round(durationInDays) + " days ago";
    } else if (durationInDays < 365) {
      const numMonths = Math.round(durationInDays / 30);
      return `${numMonths} month${numMonths > 1 ? "s" : ""} ago`;
    } else {
      const numYears = Math.round(durationInDays / 365);
      return `${numYears} year${numYears > 1 ? "s" : ""} ago`;
    }
  });

  eleventyConfig.addFilter("toDurationDays", (inputDateObj) => {
    const dateObj =
      typeof inputDateObj === "string" ? new Date(inputDateObj) : inputDateObj;
    const durationInDays =
      (new Date().getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24);
    return Math.round(durationInDays);
  });

  eleventyConfig.addFilter("sitemapDateTimeString", (dateObj) => {
    const dt = DateTime.fromJSDate(dateObj, { zone: "utc" });
    if (!dt.isValid) {
      return "";
    }
    return dt.toISO();
  });

  eleventyConfig.addFilter("toDate", (inputString) => {
    return new Date(inputString);
  });

  eleventyConfig.addFilter("isBlog", (inputArray) => {
    return inputArray ? inputArray.includes("Blog") : false;
  });

  eleventyConfig.addFilter("sitemapDateTimeString", (dateObj) => {
    const dt = DateTime.fromJSDate(dateObj, { zone: "utc" });
    if (!dt.isValid) {
      return "";
    }
    return dt.toISO();
  });

  /**
   * For assigning new attributes to a post from postData
   */
  eleventyConfig.addFilter("assignAttributes", function (post, postData) {
    for (const att of postAttributes) {
      if (postData[att]) post[att] = postData[att];
    }
    return post;
  });

  /**
   * Create a new post list based on a tag
   * posts: eg. cat_ex_posts
   * tag: tagId
   */
  eleventyConfig.addFilter("filterByTag", function (posts, tag) {
    const filteredPosts = [];
    for (const post of posts) {
      if (!post?.hide) {
        if (tag !== "all") {
          for (const tg of post?.tags) {
            if (tg == tag) {
              const singlePost = {
                title: post?.title || "",
                url: post?.url || "",
              };
              if (post?.date) singlePost.date = new Date(post.date);
              if (post?.tags) singlePost.tags = post.tags;
              if (post?.inputPath) singlePost.inputPath = post.inputPath;
              for (const att of postAttributes) {
                if (post[att]) singlePost[att] = post[att];
              }
              filteredPosts.push(singlePost);
            }
          }
        } else {
          const singlePost = {
            title: post?.title || "",
            url: post?.url || "",
          };
          if (post?.date) singlePost.date = new Date(post.date);
          if (post?.tags) singlePost.tags = post.tags;
          if (post?.inputPath) singlePost.inputPath = post.inputPath;
          for (const att of postAttributes) {
            if (post[att]) singlePost[att] = post[att];
          }
          filteredPosts.push(singlePost);
        }
      }
    }
    return filteredPosts;
  });

  /**
   * Get infor from techs.json for items in skills.json
   * How to use: {% set itemInfo = techs | getTech(techId) %}
   */
  eleventyConfig.addFilter("getTech", function (techArray, techId) {
    return techArray.find((tech) => tech.id === techId);
  });

  /**
   * Get category from categories.json
   * How to use: {% set cat = categories | getCategory(catName) %}
   */
  eleventyConfig.addFilter("getCategory", function (catArr, catName) {
    return catArr.find((cate) => cate.name === catName);
  });

  /**
   * Get category from categories.json
   * How to use: {% set singleSeries = series | getSeries(basePartUrl) %}
   */
  eleventyConfig.addFilter("getSeries", function (seriesList, basePartUrl) {
    return seriesList.find((series) => series.basePartUrl === basePartUrl);
  });

  /**
   * Get list of titles from notion database
   * How to use: {% set titles = notion.json.results | getNotionPostTitle %}
   */
  eleventyConfig.addFilter("getNotionPostTitle", function (results) {
    if (!results) return [];
    return results.map((post) => ({
      title: get(post, "properties.Name.title[0].text.content", "Untitled"),
    }));
  });

  /**
   * Check if updated? new? for a post
   * How to use: {% set status = post.date | checkDateStatus(post.inputPath) %}
   */
  eleventyConfig.addFilter(
    "checkDateStatus",
    function (postDateStr, postInputPath) {
      if (!postDateStr || !postInputPath) return null;
      const postDate = new Date(postDateStr);
      const originalDate = new Date(
        postInputPath.match(/\d{4}-\d{2}-\d{2}/gm)[0]
      );
      const inDays = 1000 * 60 * 60 * 24;
      const durationInDays =
        (new Date().getTime() - postDate.getTime()) / inDays;

      if (durationInDays < 14) {
        if (
          Math.abs(postDate.getTime() - originalDate.getTime()) / inDays <
          2
        ) {
          return "new";
        } else {
          return "updated";
        }
      }
      return null;
    }
  );

  // Get random colors (from a predefined set) for bottom-wave in blog cards
  eleventyConfig.addFilter("getRandomColor", function (name, _postIdx, idx) {
    // Get the same number for each name -> colors are fixed for each name
    function getHash(input, numColors) {
      var hash = 0,
        len = input.length;
      for (var i = 0; i < len; i++) {
        hash = (hash << 5) - hash + input.charCodeAt(i);
        hash |= 0; // to 32bit integer
      }
      return Math.abs(hash) % numColors;
    }
    const color = waveColors[getHash(name, waveColors.length)];

    // Based on index -> new posts make old posts' colors change
    // function getHash(input, numColors) {
    //   return input % numColors;
    // }
    // const color = waveColors[getHash(_postIdx, waveColors.length)];

    switch (idx) {
      case 0:
        return `rgba(${color}, 0.1)`;
      case 1:
        return `rgba(${color}, 0.05)`;
      case 2:
        return `rgba(${color}, 0.01)`;
      case 3:
        return `rgba(${color}, 0.005)`;
    }
  });

  // Used in /pages/search-index.json
  eleventyConfig.addFilter("search", (collection) => {
    var index = elasticlunr(function () {
      this.addField("title");
      this.addField("keywords");
      this.addField("tags");
      this.addField("cat");
      this.addField("icon");
      this.addField("iconColor");
      this.setRef("id");
    });
    collection.forEach((page) => {
      index.addDoc({
        id: page.url,
        title: page.title,
        keywords: page.keywords,
        tags: page.tags,
        cat: page.cat,
        icon: page.cat
          ? categories.find((item) => item.name === page.cat).fontello
          : "icon-tags",
        iconColor: page.cat
          ? _.get(
              categories.find((item) => item.name === page.cat),
              "color",
              "#fff"
            )
          : "#fff",
        target: page.target,
        privatePost: page.privatePost,
        //"content": page.templateContent,
      });
    });
    return index.toJSON();
  });

  eleventyConfig.addFilter("getBlog", (collection) => {
    return collection.filter((col) => col.name === "Blog")[0];
  });

  // Get the first `n` elements of a collection
  eleventyConfig.addFilter("head", (array, n) => {
    if (!n) return array;
    if (n < 0) return array.slice(n);
    return array.slice(0, n);
  });

  eleventyConfig.addCollection("tagList", require("./src/_11ty/getTagList"));
  eleventyConfig.addPassthroughCopy({ "notes/_data": "data" });
  eleventyConfig.addPassthroughCopy({ "notes/img": "img" });
  eleventyConfig.addPassthroughCopy({ "src/img": "img_src" });
  eleventyConfig.addPassthroughCopy({ "notes/files": "files" });
  eleventyConfig.addPassthroughCopy({ "notes/img_post": "img_post" });
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy({ "src/fonts": "fonts" }); // Copy `src/fonts` to `${distPath}/fonts`
  eleventyConfig.addPassthroughCopy({ "src/fontello": "fontello" });

  // We need to rebuild upon JS change to update the CSP.
  eleventyConfig.addWatchTarget("./src/js/");
  // We need to rebuild on CSS change to inline it.
  // eleventyConfig.addWatchTarget("./src/css/main.css");
  // Unfortunately this means .eleventyignore needs to be maintained redundantly.
  // But without this the JS build artefacts doesn't trigger a build.
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.addWatchTarget("./src/css/main.css");
  eleventyConfig.addWatchTarget("./notes/_data/");

  let markdownLibrary = markdownIt({
    html: true, // html tag inside source
    breaks: true, // use '\n' as <br>
    linkify: true, // Autoconvert URL-like text to links
  })
    .use(anchor, {
      level: 2,
      permalink: anchor.permalink.ariaHidden({
        placement: "after",
        class: "direct-link",
        symbol: '<i class="fontello-icon icon-link"></i>',
      }),
    })
    .use(require("markdown-it-mark")) // ==mark==
    .use(require("markdown-it-attrs"), {
      // use {:} options
      leftDelimiter: "{:",
      rightDelimiter: "}",
    })
    .use(require("markdown-it-emoji")) // emoji
    // .use(require("markdown-it-table-of-contents")) // [[toc]] (no spaces)
    .use(tm, {
      engine: require("katex"),
      delimiters: "dollars",
      katexOptions: { macros: { "\\RR": "\\mathbb{R}" } },
    })
    .use(require("markdown-it-task-lists")) // tasks [x]
    .use(mdItContainer, "success", {
      render: function (tokens, idx) {
        var m = tokens[idx].info.trim().match(/^col-2-equal\s+(.*)$/);
        if (tokens[idx].nesting === 1) {
          return `<div class='success alert'>
                    <div class='_icon'>
                      <img width='22' height='22' class='keep-original' src='/img_src/icons/success.svg' alt='Success icon'>
                    </div>`;
        } else {
          return "</div>";
        }
      },
    })
    .use(mdItContainer, "tip", {
      render: function (tokens, idx) {
        var m = tokens[idx].info.trim().match(/^col-2-equal\s+(.*)$/);
        if (tokens[idx].nesting === 1) {
          return `<div class='idea alert'>
                    <div class='_icon'>
                      <img width='22' height='22' class='keep-original' src='/img_src/icons/idea.svg' alt='Idea icon'>
                    </div>`;
        } else {
          return "</div>";
        }
      },
    })
    .use(mdItContainer, "idea", {
      render: function (tokens, idx) {
        var m = tokens[idx].info.trim().match(/^col-2-equal\s+(.*)$/);
        if (tokens[idx].nesting === 1) {
          return `<div class='idea alert'>
                    <div class='_icon'>
                      <img width='22' height='22' class='keep-original' src='/img_src/icons/idea.svg' alt='Idea icon'>
                    </div>`;
        } else {
          return "</div>";
        }
      },
    })
    .use(mdItContainer, "info", {
      render: function (tokens, idx) {
        var m = tokens[idx].info.trim().match(/^col-2-equal\s+(.*)$/);
        if (tokens[idx].nesting === 1) {
          return `<div class='info alert'>
                    <div class='_icon'>
                      <img width='22' height='22' class='keep-original' src='/img_src/icons/info.svg' alt='Info icon'>
                    </div>`;
        } else {
          return "</div>";
        }
      },
    })
    .use(mdItContainer, "warning", {
      render: function (tokens, idx) {
        var m = tokens[idx].info.trim().match(/^col-2-equal\s+(.*)$/);
        if (tokens[idx].nesting === 1) {
          return `<div class='warning alert'>
                    <div class='_icon'>
                      <img width='22' height='22' class='keep-original' src='/img_src/icons/warning.svg' alt='Warning icon'>
                    </div>`;
        } else {
          return "</div>";
        }
      },
    })
    .use(mdItContainer, "danger", {
      render: function (tokens, idx) {
        var m = tokens[idx].info.trim().match(/^col-2-equal\s+(.*)$/);
        if (tokens[idx].nesting === 1) {
          return `<div class='danger alert'>
                    <div class='_icon'>
                      <img width='22' height='22' class='keep-original' src='/img_src/icons/danger.svg' alt='Danger icon'>
                    </div>`;
        } else {
          return "</div>";
        }
      },
    })
    .use(mdItContainer, "code-output-equal")
    .use(mdItContainer, "code-output-flex")
    .use(mdItContainer, "code-2cols")
    .use(mdItContainer, "col-2-equal", {
      render: function (tokens, idx) {
        var m = tokens[idx].info.trim().match(/^col-2-equal\s+(.*)$/);
        if (tokens[idx].nesting === 1) {
          if (!m) {
            return "<div class='col-2-equal'>";
          } else {
            return "<div class='col-2-equal " + m[1] + "'>";
          }
        } else {
          return "</div>";
        }
      },
    })
    .use(mdItContainer, "col-2-flex", {
      render: function (tokens, idx) {
        var m = tokens[idx].info.trim().match(/^col-2-flex\s+(.*)$/);
        if (tokens[idx].nesting === 1) {
          if (!m) {
            return "<div class='col-2-flex'>";
          } else {
            return "<div class='col-2-flex " + m[1] + "'>";
          }
        } else {
          return "</div>";
        }
      },
    })
    .use(mdItContainer, "col-2-list")
    .use(mdItContainer, "list-item") // for items like in MacOS fresh start post
    .use(require("markdown-it-kbd")) // [[Ctrl]]
    .use(require("markdown-it-footnote"))
    .use(mdItContainer, "hsbox", {
      // validate: function (params) {
      //   return params.trim().match(/^hsbox\s+(.*)$/);
      // },
      render: function (tokens, idx) {
        var m = tokens[idx].info.trim().match(/^hsbox\s+(.*)$/);
        if (tokens[idx].nesting === 1) {
          renderedTitle = m
            ? markdownItp.renderInline(m[1])
            : "Toggle hidden content!";
          return (
            '<div class="hsbox"><div class="hs__title">' +
            renderedTitle +
            '</div><div class="hs__content">'
          );
        } else {
          return "</div></div>";
        }
      },
    })
    .use(require("@gerhobbelt/markdown-it-inline-text-color"))
    .use(require("markdown-it-image-lazy-loading"), {
      decoding: true,
    });
  eleventyConfig.setLibrary("md", markdownLibrary);

  // Using {% markdown %}{% endmarkdown %} inside .njk
  eleventyConfig.addPairedShortcode("markdown", (content, inline = null) => {
    return inline
      ? markdownLibrary.renderInline(content)
      : markdownLibrary.render(content);
  });

  eleventyConfig.addPairedShortcode("hsbox", (content, title) => {
    return (
      '<div class="hsbox"><div class="hs__title">' +
      markdownLibrary.renderInline(title) +
      '</div><div class="hs__content">' +
      markdownLibrary.render(content) +
      "</div></div>"
    );
  });

  // Using {% ref "url" %}
  eleventyConfig.addShortcode("ref", function (url) {
    return (
      '<sup><a href="' +
      url +
      '" rel="noopener noreferrer" target="_blank">[ref]</a></sup>'
    );
  });

  // Using {% icon "time" %}
  // Keys: time | danger | success | info | warning | idea | draft
  eleventyConfig.addShortcode("icon", function (icon) {
    return (
      '<img width="25" height="25" class="keep-original" src="/img_src/icons/' +
      icon +
      '.svg" alt="' +
      icon +
      '" style="vertical-align: middle; margin-right: 5px;">'
    );
  });

  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (_err, browserSync) {
        const content_404 = fs.readFileSync(distPath + "/404.html");

        browserSync.addMiddleware("*", (req, res) => {
          res.write(content_404);
          res.end();
        });
      },
    },
    ui: false,
    ghostMode: false,
  });

  return {
    templateFormats: ["md", "njk", "html", "liquid"],
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: ".",
      includes: "src/_includes",
      data: dataDir,
      output: distPath,
    },
  };
};
