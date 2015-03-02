'use strict';


exports.extension = ['ejs', 'underscore', 'lodash'];

exports.interpolation = function (val) {
  return '<%= ' + val + ' %>';
};

exports.pluralization = function (strings, params) {
  var ruleIds = Object.keys(strings);

  var result = '';

  var i, len;
  var key, string, rule;

  for (i = 0, len = ruleIds.length; i < len; i += 1) {
    key = ruleIds[i];

    if (key === 'else') {
      continue;
    }

    string = strings[key];
    rule = this.locale.getPluralRule(key);

    if (!rule) {
      continue;
    }

    result += i === 0 ? '<% if (' : '<% } else if (';
    result += this.processRule(rule, params) + ') { %>';
    result += this.processString(string, params);
  }

  if (strings.else) {
    result += '<% } else { %>';
    result += this.processString(strings.else, params);
  }

  result += '<% } %>';

  return result;
};
