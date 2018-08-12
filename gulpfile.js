var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var server = require('browser-sync');
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
  gulp.src('src/sass/style.scss')

      .pipe(plumber())
      .pipe(sass())
      .pipe(postcss([
          autoprefixer()
      ]))

      .pipe(gulp.dest('build/css/'))
      .pipe(minify())
      .pipe(rename('style.min.css'))
      .pipe(gulp.dest('build/css/'))
      .pipe(server.stream())
});

gulp.task('pug', function() {
  gulp.src('src/pug/index.pug')

      .pipe(plumber())
      .pipe(pug())


      .pipe(gulp.dest('build'))
      .pipe(server.stream())
});

gulp.task('serve', ['style','pug'], function () {
  server.init({
    server: 'build/'
  });

  gulp.watch('src/sass/**/*.{sass,scss}', ['style']);
  gulp.watch('src/pug/**/*.pug', ['pug']);
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
  return gulp.src('src/img/icon-*.svg')
      .pipe(svgstore({
        inlineSvg: true
      }))
      .pipe(rename('sprite.svg'))
      .pipe(gulp.dest('build/img'))
});

gulp.task('posthtml', function () {
  return gulp.src('src/*.html')
      .pipe(posthtml([
          include()
      ]))
      .pipe(gulp.dest('build'))
});

gulp.task('fonts', function () {
  gulp.src('src/fonts/**/*.*')
    .pipe(gulp.dest('build/fonts/'))

});
gulp.task('libs', function () {
  gulp.src('src/libs/**/*.*')
      .pipe(gulp.dest('build/libs/'))

});
gulp.task('clean', function () {
  gulp.src('build')
      .pipe(clean())

});

gulp.task('build', function (done) {
  run('clean','style','pug','imagemin','webp','sprite','fonts','libs','serve' , done);
});

