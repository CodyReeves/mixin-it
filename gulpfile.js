
/*---------------------------------------------------------
 Gulp Dependencies
 --------------------------------------------------------*/

const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const plumberNotifier = require('gulp-plumber-notifier');
const stripCSSComments = require('gulp-strip-css-comments');
const cleanCSS = require('gulp-clean-css');
const runSequence = require('run-sequence');

/*---------------------------------------------------------
 Required paths for Gulp
 --------------------------------------------------------*/

const paths = {
  scss: {
    src: './scss/**/*.scss',
    dest: './css/',
    file: './scss/main.scss',
  },
  css: {
    src: './css/*.css',
    dest: './css/',
    file: 'main.css',
  },
};

/*---------------------------------------------------------
 CSS/SCSS Tasks
 --------------------------------------------------------*/

/* Configures all tasks to automate
----------------------------------*/
gulp.task('watch', () => {
  gulp.watch(paths.scss.src, ['sass']);
  gulp.watch(paths.css.src, ['clean']);
});

/* Compiles all sass linking to partials in source dir, concats, creates source map, and outputs
----------------------------------*/
gulp.task('sass', () => {
  return gulp.src(paths.scss.file)
    .pipe(plumberNotifier())
    .pipe(sourcemaps.init())
    .pipe(sass({ errLogToConsole: true }))
    .pipe(concat(paths.css.file))
    .pipe(plumber.stop())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(paths.scss.dest));
});


/* Cleans CSS Removes comments and minifies stylesheet
----------------------------------*/
gulp.task('clean', () => {
  return gulp.src(paths.css.src)
    .pipe(stripCSSComments())
    .pipe(gulp.dest(paths.css.dest));
});

/*---------------------------------------------------------
 Going Live Tasks -- Pushing to server
 --------------------------------------------------------*/

/* Complies SCSS
----------------------------------*/
gulp.task('live-sass', () => {
  return gulp.src(paths.scss.file)
    .pipe(sass({ errLogToConsole: true }))
    .pipe(concat(paths.css.file))
    .pipe(gulp.dest(paths.scss.dest));
});

/* Minifies and cleans the CSS
----------------------------------*/
gulp.task('minify-css', () => {
  return gulp.src(paths.css.src)
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest(paths.css.dest));
});

/* Puts tasks into sequence
----------------------------------*/
gulp.task('live', (callback) => {
  runSequence(
    'live-sass',
    'clean',
    'minify-css',
    callback
  );
});
