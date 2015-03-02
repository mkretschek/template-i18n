'use strict';

var Processor = require('./');
var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');

/* jshint node:true, mocha:true, expr:true */


function loadFile(filename) {
  var file = path.join(__dirname, '..', '..', 'test', filename);
  return fs.readFileSync(file, 'utf8');
}


describe('Processor', function () {
  var STRING_FILE_YAML = path.join(__dirname, '..', '..', 'test', 'test.yml');
  var STRING_FILE_JSON = path.join(__dirname, '..', '..', 'test', 'test.json');

  var processor;

  it('is accessible', function () {
    expect(Processor).to.be.defined;
  });

  it('is a function', function () {
    expect(Processor).to.be.a('function');
  });

  describe('instance', function () {
    beforeEach(function () {
      processor = new Processor([
        STRING_FILE_JSON,
        STRING_FILE_YAML
      ]);
    });

    it('is an object', function () {
      expect(processor).to.be.an('object');
    });

    it('is an instance of Processor', function () {
      expect(processor).to.be.instanceof(Processor);
    });

    describe('#process()', function () {
      it('is accessible', function () {
        expect(processor.process).to.be.defined;
      });

      it('is a function', function () {
        expect(processor.process).to.be.a('function');
      });

      it('replaces placeholders and expands plurals in doT templates',
        function () {
          var original = loadFile('fixtures/test.dot');
          var expected = loadFile('expected/dot-processor.dot');

          expect(processor.process(original)).to.equal(expected);
        });

      it('replaces placeholders and expands plurals in ejs templates',
        function () {
          var processor = new Processor(STRING_FILE_YAML, {
            processor: 'ejs'
          });

          var original = loadFile('fixtures/test.ejs');
          var expected = loadFile('expected/ejs-processor.ejs');

          expect(processor.process(original)).to.equal(expected);
        });

      it('replaces placeholders and expands plurals in underscore templates',
        function () {
          var processor = new Processor(STRING_FILE_YAML, {
            processor: 'underscore'
          });

          var original = loadFile('fixtures/test.underscore.html');
          var expected = loadFile('expected/underscore-processor.html');

          expect(processor.process(original)).to.equal(expected);
        });

      it('replaces placeholders and expands plurals in lodash templates',
        function () {
          var processor = new Processor(STRING_FILE_YAML, {
            processor: 'lodash'
          });

          var original = loadFile('fixtures/test.lodash.html');
          var expected = loadFile('expected/lodash-processor.html');

          expect(processor.process(original)).to.equal(expected);
        });
    }); // #process
  }); // #instance


});