"use strict";
const prettier = require("prettier/standalone");
const plugins = [require("prettier/parser-html"), require("prettier/parser-markdown")];
const fs = require("fs");
const path = require("path");

function dumpPrettier(html) {
  let location = path.join(__dirname, "../tmp/prettier.html");
  if (!fs.existsSync(location)) {
    if (!fs.existsSync(path.dirname(location))) {
      fs.mkdirSync(path.dirname(location), { recursive: true });
    }
    fs.writeFileSync(location, html);
  }

  return html;
}

module.exports = function (html, data) {
  // hexo.extend.filter.register("after_render:html"
  // entire html
  if (typeof html == "string") {
    let pret = prettier.format(html, {
      parser: "markdown",
      plugins,
    });
    return dumpPrettier(pret);
  }

  //hexo.extend.filter.register("after_post_render"
  // only post content
  if (typeof html == "object") {
    html.content = prettier.format(html.content, {
      parser: "html",
      plugins,
    });
  }

  return html;
};
