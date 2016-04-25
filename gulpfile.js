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
      baseDir: "./dist/"
    }
  });
});

gulp.task('bs-reload', function() { browserSync.reload(); });

gulp.task('watch', ['browser-sync'], function() {
  // Template Files
  gulp.watch('./src/**/*.html', ['nunjucks']);
  // Project Styles
  gulp.watch('./src/**/*.scss', ['styles'])
});

// ======================
// TEMPLATES
// ======================

gulp.task('nunjucks', function() {
  nunjucksRender.nunjucks.configure('./src/');
  gulp.src('./src/**/*.+(html|nunjucks)')
    .pipe(nunjucksRender())
    .pipe(prettify({indent_size: 2}))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.reload({ stream: true }))
});

// ======================
// STYLES
// ======================

// Basic Styles
gulp.task('styles', function() {
  return sass('./src/bolt.scss', {})
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
    .pipe(gulp.dest('./dist/styles'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/styles'))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(notify({ message: 'DEVELOPMENT STYLES task complete' }));
});

// IE Styles
gulp.task('styles-ie', function() {
  return sass(['./src/styles/ie.scss'], { style: 'nested' })
    .pipe(plumber({ errorHandler: onError }))
    .pipe(autoprefixer(
      'last 2 version',
      'ie 7',
      'ie 8',
      'ie 9'
    ))
    .pipe(concat('ie.css'))
    .pipe(gulp.dest('./dist/styles'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('./dist/styles'))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(notify({ message: 'IE STYLES task complete' }));
});

// ======================
// CHECKS
// ======================

gulp.task('check', function() {
  return gulp.src([
    'dist/styles/main.min.css',
    'dist/**/*.html'
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
    'check',
    'styles',
    'styles-ie'
    callback);
});
