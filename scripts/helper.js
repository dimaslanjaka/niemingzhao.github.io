// noinspection DuplicatedCode

"use strict";
const _ = require("lodash");
const stringify = require("fast-json-stable-stringify");
const log = require("hexo-log")({
  debug: false,
  silent: false,
});

hexo.extend.helper.register("str_replace", function (replacements, string) {
  if (Array.isArray(replacements)) {
    for (const key in replacements) {
      if (replacements.hasOwnProperty(key)) {
        let obj = replacements[key];
        for (const objKey in obj) {
          if (obj.hasOwnProperty(objKey)) {
            string = string.replace(objKey, replacements[objKey]);
          }
        }
      }
    }
  } else if (typeof replacements == "string") {
    string = string.replace(replacements);
  }
  return string;
});

hexo.extend.helper.register("trim_whitespace", function (str, replacement) {
  if (!replacement) replacement = "";
  if (str) return str.replace(/\s+/g, replacement);
  return str;
});

hexo.extend.helper.register("trim_str", function (str) {
  return _.trim(str);
});

hexo.extend.helper.register("capitalize", function (str) {
  return _.startCase(_.toLower(str));
});

hexo.extend.helper.register("escape_double_quotes", function (str, replacement) {
  if (!replacement) replacement = '\\"';
  return str.replace(/"/g, replacement);
});

function getPosition(str, m, i) {
  return str.split(m, i).join(m).length;
}

hexo.extend.helper.register("get_thumbnail", function (post) {
  const config = hexo.config;
  let url = post.thumbnail || post.cover || null;
  //const hasThumbnail = hexo.extend.helper.get("has_thumbnail").bind(this)(post);
  if (url && config.post_asset_folder && !/http[s]*.*|\/\/.*/.test(url)) {
    var link = post.permalink;
    var beginPos = getPosition(link, "/", 3) + 1;
    var endPos = link.lastIndexOf("/") + 1;
    link = link.substring(beginPos, endPos);

    var linkArray = link.split("/").filter((s) => s !== "");
    var urlArray = url.split("/").filter((s) => s !== "");
    if (linkArray[linkArray.length - 1] === urlArray[0]) {
      urlArray.shift();
    }
    url = "/" + link + urlArray.join("/");
  } else if (!url) {
    var imgPattern = /<img\s.*?\s?src\s*=\s*['|"]?([^\s'"]+).*?>/gi;
    var result = imgPattern.exec(post.content);
    if (result && result.length > 1) {
      url = result[1];
    } else {
      url = this.url_for("/images/random/material-" + (Math.round(Math.random() * 18) + 1) + ".png");
    }
  }
  return url;
});

hexo.extend.helper.register("get_author_name", function (page, config, theme) {
  const get_author = function (pageConf) {
    const author = pageConf.author;
    if (typeof author == "string") {
      return author;
    }
    if (typeof author == "object") {
      if (typeof author.nick == "string") {
        return author.nick;
      }
      // noinspection JSUnresolvedVariable
      if (typeof author.nickname == "string") {
        // noinspection JSUnresolvedVariable
        return author.nickname;
      }
      if (typeof author.name == "string") {
        return author.name;
      }
    }
  };
  let find = get_author(page);
  if (!find && typeof config == "object") {
    find = get_author(config);
  } else if (!find && typeof theme == "object") {
    find = get_author(theme);
  }
  if (typeof find == "string" && find.trim().length > 0) return find;
  return "Unknown Author";
});

hexo.extend.helper.register("json_encode", function (obj) {
  return stringify(obj);
});

hexo.extend.helper.register(
  "escape_with_json",
  /**
   *
   * @param {any} str
   * @returns
   */
  function (str) {
    let json = JSON.stringify(str);
    if (typeof str == "string") {
      return json;
    } else {
      return str;
    }
  }
);
