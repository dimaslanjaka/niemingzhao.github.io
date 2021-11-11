// noinspection DuplicatedCode

"use strict";
const _ = require("lodash");
const fs = require("fs");
const assign = require("object-assign");
const path = require("path");
const moment = require("moment");
const { memoize } = require("underscore");
const log = require("hexo-log")({
  debug: false,
  silent: false,
});
const util = require("util");

function remove_object_key(obj, key) {
  for (let prop in obj) {
    if (prop === key) {
      delete obj[prop];
    } else if (typeof obj[prop] === "object") {
      remove_object_key(obj[prop]);
    }
  }
}

hexo.extend.helper.register("remove_object_key", function (obj, keys) {
  if (Array.isArray(keys)) {
    keys.map(function (key) {
      remove_object_key(obj, key);
    });
  } else if (typeof keys == "string") {
    remove_object_key(obj, keys);
  }
  return obj;
});

hexo.extend.helper.register("writefile", function (file, content) {
  let fp = path.join(__dirname, "../tmp", file);
  if (!fs.existsSync(path.dirname(fp))) {
    fs.mkdirSync(path.dirname(fp));
  }
  if (typeof content != "string") {
    if (Array.isArray(content) || typeof content == "object") {
      //content = stringify(content, { censor: true });
      content = util.inspect(content);
    }
  }
  fs.writeFileSync(fp, content);
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
    url = config.url + "/" + link + urlArray.join("/");
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

/**
 * get author
 * @param {Object} pageConf
 * @param {string|{link?:string,name?:string,url?:string,nickname?:string,nick?:string}} pageConf.author
 * @returns
 */
const get_author = function (pageConf) {
  const author = assign(pageConf.author, {
    name: null,
    url: null,
  });
  if (typeof pageConf.author == "string") {
    author.name = pageConf.author;
  }
  if (typeof author == "object") {
    if (typeof pageConf.author.link == "string") {
      author.url = pageConf.author.link;
    }
    if (typeof author.nick == "string") {
      author.name = author.nick;
    }
    // noinspection JSUnresolvedVariable
    if (typeof author.nickname == "string") {
      // noinspection JSUnresolvedVariable
      author.name = author.nickname;
    }
    if (typeof author.name == "string") {
      author.name = author.name;
    }
  }
  return author;
};

const isValidHttpUrl = memoize(function (string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
});

hexo.extend.helper.register("get_author_url", function (page, config, theme) {
  let find = get_author(page).url;
  if (!find && typeof config == "object") {
    find = get_author(config).url;
  } else if (!find && typeof theme == "object") {
    find = get_author(theme).url;
  }
  if (typeof find == "string" && isValidHttpUrl(find.trim()) && find.trim().length > 0) return find;
  return page.url;
});

hexo.extend.helper.register("get_author_name", function (page, config, theme) {
  let find = get_author(page).name;
  if (!find && typeof config == "object") {
    find = get_author(config).name;
  } else if (!find && typeof theme == "object") {
    find = get_author(theme).name;
  }
  if (typeof find == "string" && find.trim().length > 0) return find;
  return "Unknown Author";
});

hexo.extend.helper.register("get_date_modified", function (page) {
  if (typeof page.modified == "string") {
    return moment(page.modified, "YYYY-MM-DD HH:mm:ss");
  }
  console.log(page.source, page.full_source);
  if (page.date) {
    return moment(page.date, "YYYY-MM-DD HH:mm:ss");
  }

  return moment(new Date(), "YYYY-MM-DD HH:mm:ss");
});
