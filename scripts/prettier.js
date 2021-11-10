"use strict";
const prettier = require("prettier/standalone");
const plugins = [require("prettier/parser-html")];
const fs = require("fs");
const path = require("path");

module.exports = function (data) {
  let pretty = prettier.format(data.content, {
    parser: "html",
    plugins,
  });

  let location = path.join(__dirname, "../tmp/prettier.html");
  if (!fs.existsSync(location)) {
    if (!fs.existsSync(path.dirname(location))) {
      fs.mkdirSync(path.dirname(location), { recursive: true });
    }
    fs.writeFileSync(location, pretty);
  }

  return data;
};
