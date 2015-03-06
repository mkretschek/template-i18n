'use strict';


var glob = require('glob');
var _ = require('lodash');
var async = require('async');

var Processor = require('./processor');
var Locale = require('./locale');

module.exports = function (template, sources, options, callback) {
  module.exports.getProcessor(sources, options, function (err, processor) {
    if (err) {
      return callback(err, null);
    }

    try {
      callback(null, processor.process(template));
    } catch (err) {
      callback(err, null);
    }
  });
};


module.exports.getProcessor = function (sources, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }

  if (!callback) {
    throw new Error('Missing callback');
  }

  getSources(sources, function (err, src) {
    if (err) {
      callback(err, null);
    }

    try {
      callback(null, new Processor(src, options));
    } catch (err) {
      callback(err, null);
    }
  });
};


module.exports.Processor = Processor;
module.exports.Locale = Locale;


function getSources(source, callback) {
  var tasks = [];

  if (Array.isArray(source)) {
    tasks = _.map(source, function (src) {
      return function (done) {
        glob(src, done);
      };
    });

    async.parallel(tasks, function (err, result) {
      if (err) {
        return callback(err, null);
      }

      callback(null, _.uniq(result));
    });
  } else {
    glob(source, callback);
  }
}