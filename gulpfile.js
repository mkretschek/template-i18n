'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var yargs = require('yargs');

var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var argv = yargs.argv;

gulp.task('test', function () {
  var reporter = argv.reporter || 'dot';
  return gulp.src('lib/**/*.test.js', {read: false})
    .pipe(mocha({reporter: reporter}));
});