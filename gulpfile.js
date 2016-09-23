// ======================
// DEPENDENCIES
// ======================

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

// ======================
// AUTOMATION
// ======================

var onError = function(err) {
  notify.onError({
    title: "Gulp",
    subtitle: "Failure!",
    message: "Error: <%= error.message %>",
    sound: "Beep"
  })(err);
  this.emit('end');
};

var reload = browserSync.reload;

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "./"
    }
  });
});

gulp.task('bs-reload', function() { browserSync.reload(); });

gulp.task('watch', ['browser-sync'], function() {
  // HTML Files
  gulp.watch('./**/*.html'), ['bs-reload'];
  // Project Styles
  gulp.watch('./**/*.scss', ['build'])
});

// ======================
// STYLES
// ======================

// Dev Styles
gulp.task('styles-dev', function() {
  sass('src/bolt.scss')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(postcss([
      autoprefixer({browsers: ['last 2 version']}),
      pxtorem({
        rootValue: 16,
        replace: true,
        propWhiteList: [],
        mediaQuery: false
      })
    ]))
    .pipe(sourcemaps.init())
    .pipe(concat('bolt.css'))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(notify({ message: 'DEVELOPMENT STYLES task complete'}))
});

// Styles Production
gulp.task('styles-prod', function() {
  return sass('src/bolt.scss', { style: 'nested' })
    .pipe(plumber({ errorHandler: onError }))
    .pipe(postcss([
      autoprefixer({browsers: ['last 2 version']}),
      pxtorem({
        rootValue: 16,
        replace: true,
        propWhiteList: [],
        mediaQuery: false
      }),
      cssnano({
        discardComments: {removeAll: true}
      })
    ]))
    .pipe(concat('bolt.min.css'))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(notify({ message: 'PRODUCTION STYLES task complete' }));
});

// IE Styles
gulp.task('styles-ie', function() {
  return sass(['styles/manifest-ie.scss'], { style: 'nested' })
    .pipe(plumber({ errorHandler: onError }))
    .pipe(postcss([autoprefixer({browsers: [
      'last 2 version',
      'ie 7',
      'ie 8',
      'ie 9'
    ]})]))
    .pipe(concat('ie.main.css'))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(notify({ message: 'IE STYLES task complete' }));
});

// ======================
// CLEAN
// ======================

// Clean Styles
gulp.task('clean:styles', function () {
  return del('css/**/*.css');
});

// ======================
// BUILD
// ======================

gulp.task('build', function(callback) {
  runSequence(
    'clean:styles',
    'styles-dev',
    'styles-prod',
    callback
  );
});
