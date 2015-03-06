'use strict';

var _ = require('lodash');
var path = require('path');
var util = require('./util');


function Locale(options) {
  this.strings = {};
  this.options = _.extend({}, Locale.DefaultOptions, options || {});
}

Locale.DefaultOptions = {
  plural: '_plural'
};


Locale.prototype.load = function (src) {
  if (Array.isArray(src)) {
    _.forEach(src, function (s) {
      this.load(s);
    }, this);

    return;
  }

  var ext = path.extname(src);

  switch (ext) {
    case '.yaml':
    case '.yml':
      _.merge(this.strings, util.loadYAML(src));
      break;

    case '.json':
    case '.js':
      _.merge(this.strings, util.loadJSON(src));
      break;
  }
};


Locale.prototype.getPluralRule = function (id) {
  var plural = this.strings[this.options.plural] || {};
  var rule = util.dig(plural, id);

  if (!rule) {
    throw new Error('Missing plural rule: ' + id);
  }

  return rule;
};


Locale.prototype.getString = function (id) {
  var string = util.dig(this.strings, id);

  if (!string) {
    return id;
  }

  return string;
};



Locale.loadSources = function (src) {
  var locale = new Locale();

  if (src) {
    if (Array.isArray(src)) {
      src.forEach(function (s) {
        locale.load(s);
      });
    } else {
      locale.load(src);
    }
  }

  return locale;
};



module.exports = Locale;