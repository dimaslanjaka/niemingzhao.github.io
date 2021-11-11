"use strict";
/// <reference path="./index.d.ts"/>

/**
 * fix json stringify of cycles or maximum number of searialized objects
 * @see {@link https://stackoverflow.com/a/9653082}
 * @param {any} censor
 * @returns
 */
function censor(censor) {
  var i = 0;

  return function (key, value) {
    if (i !== 0 && typeof censor === "object" && typeof value == "object" && censor == value) return "[Circular]";

    if (i >= 29)
      // seems to be a harded maximum of 30 serialized objects?
      return "[Unknown]";

    ++i; // so we know we aren't using the original object anymore

    return value;
  };
}

/**
 * Process json
 * @param {any} data
 * @param {import("fast-json-stable-stringify").opt} opts
 * @returns
 */
function process_json(data, opts) {
  if (!opts) opts = {};
  if (typeof opts === "function") opts = { cmp: opts };
  const cycles = typeof opts.cycles === "boolean" ? opts.cycles : false;
  if (typeof opts.censor != "undefined") {
    return JSON.stringify(censor(data), opts);
  }

  var cmp =
    opts.cmp &&
    (function (f) {
      return function (node) {
        return function (a, b) {
          var aobj = { key: a, value: node[a] };
          var bobj = { key: b, value: node[b] };
          return f(aobj, bobj);
        };
      };
    })(opts.cmp);

  var seen = [];
  return (function stringify(node) {
    if (node && node.toJSON && typeof node.toJSON === "function") {
      node = node.toJSON();
    }

    if (node === undefined) return;
    if (typeof node == "number") return isFinite(node) ? "" + node : "null";
    if (typeof node !== "object") return JSON.stringify(node);

    var i, out;
    if (Array.isArray(node)) {
      out = "[";
      for (i = 0; i < node.length; i++) {
        if (i) out += ",";
        out += stringify(node[i]) || "null";
      }
      return out + "]";
    }

    if (node === null) return "null";

    if (seen.indexOf(node) !== -1) {
      if (cycles) return JSON.stringify("__cycle__");
      throw new TypeError("Converting circular structure to JSON");
    }

    var seenIndex = seen.push(node) - 1;
    var keys = Object.keys(node).sort(cmp && cmp(node));
    out = "";
    for (i = 0; i < keys.length; i++) {
      var key = keys[i];
      var value = stringify(node[key]);

      if (!value) continue;
      if (out) out += ",";
      out += JSON.stringify(key) + ":" + value;
    }
    seen.splice(seenIndex, 1);
    return "{" + out + "}";
  })(data);
}

module.exports = process_json;
