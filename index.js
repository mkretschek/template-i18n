'use strict';

var Processor = require('./processor');
var Locale = require('./locale');

module.exports = function (template, sources, options) {
  var processor = new Processor(sources, options);
  return processor.process(template);
};


module.exports.getProcessor = function (sources, options) {
  return new Processor(sources, options);
};


module.exports.Processor = Processor;
module.exports.Locale = Locale;