// =====================================
// *
// * DEPENDENCIES
// *
// =====================================

var gulp = require('gulp'),
  sass = require('gulp-ruby-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify'),
  watch = require('gulp-watch'),
  gutil = require('gulp-util'),
  plumber = require('gulp-plumber'),
  browserSync = require('browser-sync'),
  nunjucksRender = require('gulp-nunjucks-render'),
  prettify = require('gulp-prettify'),
  runSequence = require('run-sequence').use(gulp),
  symdiff = require('gulp-symdiff'),
  symdiffhtml = require('symdiff-html'),
  symdiffcss = require('symdiff-css'),
  fs = require('fs'),
  del = require('del'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  cssnano = require('cssnano'),
  pxtorem = require('postcss-pxtorem');

  // =====================================
  // *
  // * DEFAULT SETTINGS
  // *
  // =====================================

  // Autoprefixer
  var autoPrefix = [
    'last 3 versions',
    'last 8 Safari versions',
    'last 15 Chrome versions',
    'last 5 IE versions',
    'last 15 Firefox versions',
    'last 5 Edge versions',
    'last 15 Opera versions',
    'last 5 iOS versions',
    'last 5 Android versions',
    'last 5 ChromeAndroid versions'
  ];

  // =====================================
  // *
  // * AUTOMATION
  // *
  // =====================================

  // Easy reload
  gulp.task('bs-reload', function() {
    browserSync.reload();
  });

  // Watch
  gulp.task('watch', function() {
    // Initalize browserSync
    browserSync.init({
      server: {
        baseDir: "./"
      }
    });
    // Watch for changes in files
    gulp.watch('./**/*.html'), ['bs-reload'];
    gulp.watch('./**/*.scss', ['build'])
  });

  // Errors
  var onError = function(err) {
    notify.onError({
      title: "Gulp",
      subtitle: "Failure!",
      message: "Error: <%= error.message %>",
      sound: "Beep"
    })(err);
    this.emit('end');
  };

// =====================================
// *
// * STYLES
// *
// =====================================

// =====================================
// Clean
// =====================================
gulp.task('clean:styles', function () {
  return del('dist/**/*.css');
});

// =====================================
// All styles
// =====================================
gulp.task('styles-all', function() {
  return sass('./src/bolt.scss', {})
    .pipe(plumber({ errorHandler: onError }))
    .pipe(concat('bolt.css'))
    .pipe(gulp.dest('./dist'))
    .pipe(postcss([
      autoprefixer({browsers: autoPrefix}),
      pxtorem({
        rootValue: 16,
        replace: true,
        propWhiteList: [],
        mediaQuery: false
      }),
      cssnano({discardComments: {removeAll: true}})
    ]))
    .pipe(concat('bolt.min.css'))
    .pipe(gulp.dest('./dist'));
});

// =====================================
// Partials
// =====================================

// Grid
gulp.task('styles-grid', function() {
  return sass('./src/grid.scss', {})
    .pipe(plumber({ errorHandler: onError }))
    .pipe(concat('grid.css'))
    .pipe(gulp.dest('./dist'))
    .pipe(postcss([
      autoprefixer({browsers: autoPrefix}),
      pxtorem({
        rootValue: 16,
        replace: true,
        propWhiteList: [],
        mediaQuery: false
      }),
      cssnano({discardComments: {removeAll: true}})
    ]))
    .pipe(concat('grid.min.css'))
    .pipe(gulp.dest('./dist'));
});

// Flexbox
gulp.task('styles-flexbox', function() {
  return sass('./src/flexbox.scss', {})
    .pipe(plumber({ errorHandler: onError }))
    .pipe(concat('flexbox.css'))
    .pipe(gulp.dest('./dist'))
    .pipe(postcss([
      autoprefixer({browsers: autoPrefix}),
      pxtorem({
        rootValue: 16,
        replace: true,
        propWhiteList: [],
        mediaQuery: false
      }),
      cssnano({discardComments: {removeAll: true}})
    ]))
    .pipe(concat('flexbox.min.css'))
    .pipe(gulp.dest('./dist'));
});

// Type scale
gulp.task('styles-type-scale', function() {
  return sass('./src/type-scale.scss', {})
    .pipe(plumber({ errorHandler: onError }))
    .pipe(concat('type-scale.css'))
    .pipe(gulp.dest('./dist'))
    .pipe(postcss([
      autoprefixer({browsers: autoPrefix}),
      pxtorem({
        rootValue: 16,
        replace: true,
        propWhiteList: [],
        mediaQuery: false
      }),
      cssnano({discardComments: {removeAll: true}})
    ]))
    .pipe(concat('type-scale.min.css'))
    .pipe(gulp.dest('./dist'));
});

// =====================================
// *
// * Build
// *
// =====================================

gulp.task('build', function(callback) {
  runSequence(
    'clean:styles',
    'styles-all',
    'styles-grid',
    'styles-flexbox',
    'styles-type-scale',
    callback
  );
});
