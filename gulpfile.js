'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');

var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

gulp.task('test', function () {
  return gulp.src('lib/**/*.test.js', {read: false})
    .pipe(mocha({reporter: 'dot'}));
});