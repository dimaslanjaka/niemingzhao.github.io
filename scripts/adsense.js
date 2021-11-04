const config = hexo.config;
const fs = require("hexo-fs");

/**
 * Adsense Injector
 * @param {object} data
 */
module.exports = function (data) {
  if (typeof hexo.adsense == "object") {
    if (hexo.adsense.enable) {
      if (typeof hexo.adsense.pub == "string" && hexo.adsense.pub.trim().length > 0) {
      }
    }
  }
};
