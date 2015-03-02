'use strict';

/* jshint node:true, mocha:true, expr:true */

var path = require('path');
var Locale = require('./locale');

var expect = require('chai').expect;

describe('Locale', function () {
  var STRING_FILE_YAML = path.join(__dirname, '..', 'test', 'test.yml');
  var STRING_FILE_JSON = path.join(__dirname, '..', 'test', 'test.json');

  it('is accessible', function () {
    expect(Locale).to.be.defined;
  });

  it('is a function', function () {
    expect(Locale).to.be.a('function');
  });

  describe('instance', function () {
    var locale;

    beforeEach(function () {
      locale = new Locale();
    });

    it('is an object', function () {
      expect(locale).to.be.an('object');
    });

    it('is an instance of Locale', function () {
      expect(locale).to.be.instanceof(Locale);
    });

    describe('#load()', function () {
      it('is accessible', function () {
        expect(locale.load).to.be.defined;
      });

      it('is a function', function () {
        expect(locale.load).to.be.a('function');
      });

      it('loads the given file', function () {
        expect(locale.strings).to.not.have.property('plural');
        locale.load(STRING_FILE_YAML);
        expect(locale.strings).to.have.property('plural');
      });

      it('works with YAML', function () {
        expect(locale.strings).to.not.have.property('plural');
        locale.load(STRING_FILE_YAML);
        expect(locale.strings).to.have.property('plural');
      });

      it('works with JSON', function () {
        expect(locale.strings).to.not.have.property('foo');
        locale.load(STRING_FILE_JSON);
        expect(locale.strings).to.have.property('foo');
      });
    });


    describe('#getPluralRule()', function () {
      beforeEach(function () {
        locale.load(STRING_FILE_YAML);
      });

      it('is is accessible', function () {
        expect(locale.getPluralRule).to.be.defined;
      });

      it('is a function', function () {
        expect(locale.getPluralRule).to.be.a('function');
      });

      it('returns a plural rule', function () {
        expect(locale.getPluralRule('1')).to.equal('{n} == 1');
      });
    });


    describe('#getString()', function () {
      beforeEach(function () {
        locale.load(STRING_FILE_YAML);
      });

      it('is is accessible', function () {
        expect(locale.getString).to.be.defined;
      });

      it('is a function', function () {
        expect(locale.getString).to.be.a('function');
      });

      it('returns a string', function () {
        expect(locale.getString('test.simple')).to.equal('This is a simple test');;
      });

      it('returns the id itself if string is not found', function () {
        expect(locale.getString('this.does.not.exist')).to.equal('this.does.not.exist');
      })
    });

  }); // instance

  describe('.loadSources()', function () {
    it('is accessible', function () {
      expect(Locale.loadSources).to.be.defined;
    });

    it('is a function', function () {
      expect(Locale.loadSources).to.be.a('function');
    });

    it('returns a locale instance', function () {
      expect(Locale.loadSources()).to.be.instanceof(Locale);
    });

    it('loads the given sources', function () {
      var locale = Locale.loadSources([
        STRING_FILE_JSON,
        STRING_FILE_YAML
      ]);

      expect(locale.strings).to.have.property('foo');
      expect(locale.strings).to.have.property('plural');
    });
  });
});
