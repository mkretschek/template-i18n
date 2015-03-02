'use strict';

var fs = require('fs');
var yaml = require('js-yaml');


exports.eval = function (val) {
  return new Function('return ' + val + ';')();
};

exports.loadYAML = function (path) {
  return yaml.safeLoad(fs.readFileSync(path, 'utf8'));
};

exports.loadJSON = function (path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
};

exports.dig = function (obj, id) {
  var key, val, split;

  split = id.split('.');
  val = obj;

  var i = 0;

  while (
    (key = split[i]) &&
    (val && typeof val === 'object')
  ) {
    val = val[key];
    i += 1;
  }

  return val;
};

function defaultReplacer(val) {
  return val;
}

exports.processString = function (string, params, replacer) {
  replacer = replacer || defaultReplacer;

  return string.replace(/\{(\w+)}/g, function ($0, $1) {
    var val = params[$1];

    if (!val) {
      return $0;
    }

    return replacer(val);
  });
};


exports.removeInvalidFiles__ = function (files) {
  return files.filter(function (file) {
    if (!exports.exists(file)) {
      return false;
    }

    return true;
  });
};


exports.isDir__ = function (path) {
  var lastChar = path && path[path.length - 1];
  return lastChar === '/' || lastChar === '\\';
};