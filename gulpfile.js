var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var jade = require('gulp-jade');
var templateCache = require('gulp-angular-templatecache');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var wrap = require('gulp-wrap');
var isProduction = process.env.NODE_ENV === 'production';

var wrapJS = wrap('(function(){\n"use strict";\n<%= contents %>\n})();');

gulp.task('javascripts', function() {
  return gulp.src('app/javascripts/**/*.js')
    .pipe(gulpif(!isProduction, sourcemaps.init()))
    .pipe(babel())
    .pipe(ngAnnotate())
    .pipe(gulpif(isProduction, wrapJS))
    .pipe(gulpif(isProduction, uglify({mangle: true})))
    .pipe(concat('build.js'))
    .pipe(gulpif(!isProduction, sourcemaps.write('.')))
    .pipe(gulp.dest('public/assets/javascripts'));
});

gulp.task('vendorJavascripts', function() {
  return gulp.src([
      'bower_components/angular/angular.js',
      'bower_components/angular-new-router/dist/router.es5.js',
      'bower_components/angular-indexed-db/angular-indexed-db.js',
      'bower_components/codemirror/lib/codemirror.js',
      'bower_components/angular-ui-codemirror/ui-codemirror.js',
      'bower_components/lodash/lodash.js',
      'bower_components/lodash-mix/index.js',
    ])
    .pipe(gulpif(isProduction, uglify({mangle: false})))
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('public/assets/javascripts'));
});

gulp.task('ngtemplates', function() {
  return gulp.src(['app/javascripts/**/*.jade'])
    .pipe(jade({pretty: false}))
    .pipe(templateCache({module: 'flowApp'}))
    .pipe(gulp.dest('public/assets/javascripts'));
})

gulp.task('stylesheets', function() {
    return gulp.src('app/stylesheets/style.scss')
      .pipe(gulpif(!isProduction, sourcemaps.init()))
      .pipe(sass({
        style: 'compressed',
        includePaths: [
          'app/stylesheets/',
          'bower_components/codemirror/lib',
          'bower_components/bootstrap-sass/assets/stylesheets'
        ]
      }))
      .pipe(concat('style.css'))
      .pipe(gulpif(!isProduction, sourcemaps.init()))
      .pipe(gulp.dest('public/assets/stylesheets'));
});

gulp.task('clean', function (cb) {
  return gulp.src('public/*', {read: false})
    .pipe(clean());
});

gulp.task('templates', function() {
  return gulp.src('app/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('public'));
});


gulp.task('webserver', function() {
  connect.server({root: 'public'});
});

gulp.task('default', ['templates', 'vendorJavascripts', 'javascripts', 'ngtemplates', 'stylesheets']);

gulp.task('dev', function() {
  gulp.run(['webserver', 'default'])

  gulp.watch('app/javascripts/**/*.js', function(event) {
      gulp.run('javascripts');
  });

  gulp.watch(['app/javascripts/**/*.jade'], function(event) {
      gulp.run('ngtemplates');
  });

  gulp.watch('app/stylesheets/**/*.scss', function(event) {
      gulp.run('stylesheets');
  });
});

gulp.task('heroku:production', function(){
  runSequence('clean', 'default')
})
