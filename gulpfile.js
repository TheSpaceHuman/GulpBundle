var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var autoprefixer = require('gulp-autoprefixer');
var server = require('browser-sync').create();
var minify = require('gulp-csso');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var webp = require('gulp-webp');
var svgstore = require('gulp-svgstore');
var posthtml = require('gulp-posthtml');
var include = require('posthtml-include');
var run = require('run-sequence');
var pug = require('gulp-pug');
var clean = require('gulp-clean');



gulp.task('style', function() {
  return gulp.src('src/sass/style.{sass,scss}')
      .pipe(plumber())
      .pipe(sass())
      .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      }))

      .pipe(gulp.dest('build/css/'))
      .pipe(minify())
      .pipe(rename('style.min.css'))
      .pipe(gulp.dest('build/css/'))
      .pipe(server.stream())
});

gulp.task('pug', function() {
  return gulp.src('src/pug/*.pug')

      .pipe(plumber())
      .pipe(pug())


      .pipe(gulp.dest('build'))
      .pipe(server.stream())
});

gulp.task('server', function () {
  server.init({
    server: 'build/'
  });

  gulp.watch('src/sass/**/*.{sass,scss}', ['style']);
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/pug/**/*.pug', ['pug']).on('change', server.reload);
});

gulp.task('imagemin', function () {
  return gulp.src('src/img/**/*.{png,jpg,svg}')

      .pipe(imagemin([
          imagemin.optipng({optimizationLevel: 3}),
          imagemin.jpegtran({progressive: true}),
          imagemin.svgo()
      ]))
      .pipe(gulp.dest('build/img'))
});

gulp.task('webp', function () {
  return gulp.src('src/img/**/*.{png,jpg}')

      .pipe(webp({quality: 90}))
      .pipe(gulp.dest('build/img'))
});

gulp.task('sprite', function () {
  return gulp.src('src/img/**/icon-*.svg')
      .pipe(svgstore({
        inlineSvg: true
      }))
      .pipe(rename('sprite.svg'))
      .pipe(gulp.dest('src/img'))
});

gulp.task('posthtml', function () {
  return gulp.src('src/*.html')
      .pipe(posthtml([
          include()
      ]))
      .pipe(gulp.dest('build'))
});

gulp.task('copy', function () {
  return gulp.src([
  'src/fonts/**/*.{woff,woff2,ttf,eot}',
  'src/libs/**/*.*'
  ],{
    base:'src'
  })
      .pipe(gulp.dest('build'))
});

gulp.task('js', function () {
  return gulp.src([
    'src/js/**/*.js'
  ],{
    base:'src'
  })
      .pipe(gulp.dest('build'))
      .pipe(server.stream())
});


gulp.task('clean', function () {
    return gulp.src('build')
        .pipe(clean())

});


gulp.task('build', function (callback) {
  run('clean', 'copy', 'style', 'pug','js','sprite','imagemin', 'server', callback);
});


