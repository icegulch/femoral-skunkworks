const htmlmin = require("html-minifier");
const CleanCSS = require("clean-css");
const util = require('util');
require("dotenv").config();
const isProduction = process.env.ELEVENTY_ENV === `production`;

module.exports = function(eleventyConfig) {

  eleventyConfig.setServerOptions({
    showAllHosts: true,
  });

  eleventyConfig.addFilter("dump", (obj) => {
    return util.inspect(obj);
  });

  eleventyConfig.addFilter("limit", function (arr, limit) {
    return arr.slice(0, limit);
  });

  eleventyConfig.addFilter("randomLimit", (arr, limit, currPage) => {
    // Filters out current page
    const pageArr = arr.filter((page) => page.url !== currPage);
    // Randomizes remaining items
    pageArr.sort(() => {
      return 0.5 - Math.random();
    });
    // Returns array items up to limit
    return pageArr.slice(0, limit);
  });
  
  eleventyConfig.addFilter("pluckFromSelection", function (arr, selections, attr) {
    return arr.filter((item) => selections.includes(item[attr]));
  });
  
  eleventyConfig.addFilter("pluckByValue", function (arr, value, attr) {
    return arr.filter((item) => item[attr] === value);
  });
  
  eleventyConfig.addFilter("excludeCurrent", function (arr, selections, attr) {
    return arr.filter((item) => selections !== item[attr]);
  });

  
  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // configure markdown-it (and set it as your markdown processor for consistency)
  const md = require('markdown-it')({
    html: true,
    breaks: true,
    linkify: true,
  });

  eleventyConfig.setLibrary('md', md);

  eleventyConfig.addFilter('markdownify', str => md.render(str));

  // Minify HTML Output
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if( isProduction && outputPath && outputPath.endsWith(".html") ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });

  return {
    dir: {
      input: "src"
    },
  };

};
