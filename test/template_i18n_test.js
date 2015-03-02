'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.template_i18n = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  default_options: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/default_options.dot');
    var expected = grunt.file.read('test/expected/default_options.dot');
    test.equal(actual, expected, 'should describe what the default behavior is.');

    test.done();
  },
  dot_processor: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/dot_processor.dot');
    var expected = grunt.file.read('test/expected/dot_processor.dot');
    test.equal(actual, expected, 'should check if the doT processor works properly.');

    test.done();
  },
  ejs_processor: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/ejs_processor.ejs');
    var expected = grunt.file.read('test/expected/ejs_processor.ejs');
    test.equal(actual, expected, 'should check if the EJS processor works properly.');

    test.done();
  },
  underscore_processor: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/underscore_processor.html');
    var expected = grunt.file.read('test/expected/underscore_processor.html');
    test.equal(actual, expected, 'should check if the underscore processor works properly.');

    test.done();
  },
  custom_pattern: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/custom_pattern.dot');
    var expected = grunt.file.read('test/expected/custom_pattern.dot');
    test.equal(actual, expected, 'should check if the `pattern` and `parser` options work as expected.');

    test.done();
  }
};
