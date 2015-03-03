'use strict';

var _ = require('lodash');
var util = require('../util');
var Locale = require('../locale');


var DEFAULT_PATTERN = /\{\{:i18n\((\w+(?:\.\w+)*)(?:,\s*([^)]+))?\):?\}\}/g;

var Processors = {
  dot: './dot',
  ejs: './ejs',
  underscore: './ejs',
  lodash: './ejs'
};

function Processor(locale, options) {
  this.options = _.extend({}, Processor.DefaultOptions, options || {});

  if (_.isString(locale) || _.isArray(locale)) {
    locale = Locale.loadSources(locale, {
      plural: this.options.plural
    });
  }

  this.locale = locale;

  this.sub = getSubProcessor(
    this.options.processor,
    this.options.interpolation,
    this.options.pluralization
  );
}

Processor.DEFAULT_PARSER = defaultParser;
Processor.DEFAULT_PATTERN = DEFAULT_PATTERN;


Processor.DefaultOptions = {
  pattern: Processor.DEFAULT_PATTERN,
  parser: Processor.DEFAULT_PARSER,
  processor: 'dot',
  plural: '_plural'
};

Processor.prototype.process = function (content) {
  var self = this;

  if (!content) {
    return content;
  }

  return content.replace(this.options.pattern, function () {
    var data = self.options.parser.apply(self, arguments);
    return self._process(data.id, data.params);
  });
};


Processor.prototype._process = function (id, params) {
  var string = this.locale.getString(id);

  if (!_.isString(string) && params.n !== undefined) {
    return this.pluralization(string, params);
  }

  return this.processString(string, params);
};

Processor.prototype.processString = function (string, params) {
  var self = this;
  return util.processString(string, params, function () {
    return self.interpolation.apply(self, arguments);
  });
};

Processor.prototype.processRule = util.processString;

Processor.prototype.pluralization = function (strings, params) {
  return this.sub.pluralization.call(this, strings, params);
};

Processor.prototype.interpolation = function (val) {
  return this.sub.interpolation.call(this, val);
};


function getSubProcessor(id, interpolation, pluralization) {
  var processor;

  if (_.isObject(id)) {
    return id;
  }

  if (id) {
    processor = Processors[id];
    if (processor && _.isString(processor)) {
      try {
        processor = require(processor);
      } catch (err) {
        try {
          processor = require(id);
        } catch (err) {
          throw new Error('Unable to load ' + id + ' processor');
        }
      }
    }
  }

  if (!processor || _.isString(processor)) {
    processor = Object.create(null);
  } else {
    // Protect the original processor
    processor = Object.create(processor);
  }

  if (interpolation) {
    processor.interpolation = interpolation;
  }

  if (!processor.interpolation) {
    throw new Error('Missing interpolation builder');
  }

  if (pluralization) {
    processor.pluralization = pluralization;
  }

  if (!processor.pluralization) {
    throw new Error('Missing pluralization builder');
  }

  return processor;
}


function defaultParser(match, id, params) {
  return {
    id: id,
    params: parseParams(params)
  };
}

function parseParams(params) {
  if (!params || typeof params !== 'string') {
    return {};
  }

  if (params[0] === '{') {
    // Assume we are describing an object
    return util.eval(params);
  }

  if (params[0] === '\'') {
    return {n: util.eval(params)};
  }

  if (/^([\w\.]+)$/.test(params)) {
    return {n: params};
  }

  throw new Error('Invalid params: ' + params);
}


module.exports = Processor;