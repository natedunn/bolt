// ======================
// DEPENDENCIES
// ======================

var gulp = require('gulp')
  minifycss = require('gulp-minify-css'),
  sass = require('gulp-ruby-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  autoprefixer = require('gulp-autoprefixer'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify'),
  watch = require('gulp-watch'),
  csscomb = require('gulp-csscomb'),
  gutil = require('gulp-util'),
  plumber = require('gulp-plumber'),
  browserSync = require('browser-sync'),
  uncss = require('gulp-uncss')
  merge = require('merge2'),
  nunjucksRender = require('gulp-nunjucks-render'),
  prettify = require('gulp-prettify'),
  runSequence = require('run-sequence').use(gulp),
  symdiff = require('gulp-symdiff'),
  symdiffhtml = require('symdiff-html'),
  symdiffcss = require('symdiff-css'),
  fs = require('fs');

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
      baseDir: "./test/"
    }
  });
});

gulp.task('bs-reload', function() { browserSync.reload(); });

gulp.task('watch', ['browser-sync'], function() {
  // Template Files
  gulp.watch('test/**/*.html', ['bs-reload']);
  // Project Styles
  gulp.watch('scss/**/*.scss', ['styles'])
});

// ======================
// STYLES
// ======================

// Basic Styles
gulp.task('styles', function() {
  return sass('./scss/bolt.scss', {})
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer(
      'last 2 version',
      'safari 5',
      'firefox 15',
      'ie 9',
      'opera 12.1',
      'ios 6',
      'android 4'
    ))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./test/styles'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./test/styles'))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(notify({ message: 'DEVELOPMENT STYLES task complete' }));
});

// IE Styles
gulp.task('styles-ie', function() {
  return sass('./scss/bolt-ie.scss', {})
    .pipe(plumber({ errorHandler: onError }))
    .pipe(autoprefixer(
      'last 2 version',
      'ie 7',
      'ie 8',
      'ie 9'
    ))
    .pipe(concat('ie.css'))
    .pipe(gulp.dest('./test/styles'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('./test/styles'))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(notify({ message: 'IE STYLES task complete' }));
});

// ======================
// CHECKS
// ======================

gulp.task('check', function() {
  return gulp.src([
    'test/styles/main.min.css',
    'test/**/*.html'
  ])
    .pipe(symdiff({
      // ignore: [],
      templates: [symdiffhtml],
      css: [symdiffcss]
    })
    .on('error', function() {
        process.exit(0);
    }))
});

// ======================
// TEST
// ======================

gulp.task('test', function(callback) {
  runSequence(
    'styles',
    'styles-ie',
    callback);
});
