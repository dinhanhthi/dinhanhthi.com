const minify = require("html-minifier").minify;
const AmpOptimizer = require("@ampproject/toolbox-optimizer");

let distPath = "_site";

const ampOptimizer = AmpOptimizer.create({
  blurredPlaceholders: true,
  imageBasePath: "./" + distPath + "/",
  //verbose: true,
});
const csso = require("csso");

/**
 * Inlines the CSS.
 * Makes font display display-swap
 * Minify fontello css
 * Minifies and optimizes the JS
 * Optimizes HTML
 * Optimizes AMP
 */

const minifyCss = async (rawContent, outputPath) => {
  let content = rawContent;
  if (
    outputPath &&
    outputPath.endsWith(".html") &&
    !isAmp(content) &&
    !/data-style-override/.test(content)
  ) {
    let before = require("fs").readFileSync("src/css/main.css", {
      encoding: "utf-8",
    });
    before = before.replace(/@font-face {/g, "@font-face {font-display:swap;");
    const after = csso.minify(before).css;
    content = content.replace("</head>", `<style>${after}</style></head>`);
  }
  return content;
};

const minifyFontelloCss = async (rawContent, outputPath) => {
  let content = rawContent;
  if (
    outputPath &&
    outputPath.endsWith(".html") &&
    !isAmp(content) &&
    !/data-style-override/.test(content)
  ) {
    let before = require("fs").readFileSync("src/fontello/css/fontello.css", {
      encoding: "utf-8",
    });
    before = before.replace(/@font-face {/g, "@font-face {font-display:swap;");

    // For relative paths in fontello
    // Note that, in .eleventy.js, there is a
    // eleventyConfig.addPassthroughCopy({ "src/fontello": "fontello" });
    before = before.replace(/..\/font\/fontello/g, "/fontello/font/fontello");

    const after = csso.minify(before).css;
    content = content.replace("</head>", `<style>${after}</style></head>`);
  }
  return content;
};

const minifyCssDev = async (rawContent, outputPath) => {
  return rawContent.replace("</head>", '<link rel="stylesheet" type="text/css" href="/src/css/main.css" /></head>');
};

const minifyHtml = (rawContent, outputPath) => {
  let content = rawContent;
  if (outputPath && outputPath.endsWith(".html") && !isAmp(content)) {
    content = minify(content, {
      removeAttributeQuotes: true,
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      removeComments: true,
      sortClassName: true,
      sortAttributes: true,
      html5: true,
      decodeEntities: true,
      removeOptionalTags: true,
    });
  }
  return content;
};

const optimizeAmp = async (rawContent, outputPath) => {
  let content = rawContent;
  if (outputPath && outputPath.endsWith(".html") && isAmp(content)) {
    content = await ampOptimizer.transformHtml(content);
  }
  return content;
};

module.exports = {
  initArguments: {},
  configFunction: async (eleventyConfig, pluginOptions = {devMode: false, distPath: "_site"}) => {
    distPath = pluginOptions.distPath;
    if (pluginOptions.devMode) {
      eleventyConfig.addTransform("minifyCss", minifyCssDev);
    } else {
      eleventyConfig.addTransform("minifyCss", minifyCss);
    }
    eleventyConfig.addTransform("minifyFontelloCss", minifyFontelloCss);
    eleventyConfig.addTransform("minifyHtml", minifyHtml);
    eleventyConfig.addTransform("optimizeAmp", optimizeAmp);
  },
};

function isAmp(content) {
  return /\<html amp/i.test(content);
}
