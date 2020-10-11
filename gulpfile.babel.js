const gulp = require("gulp");
const path = require("path");

// BROWSER SYNC
var browserSync = require("browser-sync").create();

// SCSS
const sass = require("gulp-sass");
sass.compiler = require("node-sass");

// PUG
const pug = require("gulp-pug");

// JS
const babel = require("gulp-babel");
const concat = require("gulp-concat");

// PRETTY
var prettyHtml = require("gulp-pretty-html");

// POSTCSS
const tailwindcss = require("tailwindcss");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

const srcPaths = {
  tailwindConfig: "./tailwind.config.js",
  tailwind: "./src/scss/*.scss",
  scss: "./src/scss/*.scss",
  css: "./src/css/*.css",
  js: "./src/js/*.js",
  pug: "./src/*.pug",
  html: "./src/*.html",
};

const distPaths = {
  css: "./dist/css",
  js: "./dist/js",
  html: "./dist",
};

// SCSS TASK
function scssTask() {
  return gulp
    .src(srcPaths.scss)
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest(distPaths.css))
    .pipe(browserSync.stream());
}

function scssWatcher() {
  return gulp.watch(srcPaths.scss, scssTask).on("change", browserSync.reload);
}

// PUG TASK
function pugTask() {
  return gulp.src(srcPaths.pug).pipe(pug()).pipe(gulp.dest(distPaths.html));
}
function pugWatcher() {
  return gulp.watch(srcPaths.pug, pugTask).on("change", browserSync.reload);
}

// JS TASK
function jsTask() {
  return gulp
    .src(srcPaths.js)
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(concat("script.js"))
    .pipe(gulp.dest(distPaths.js));
}

function jsWatcher() {
  return gulp.watch(srcPaths.js, jsTask).on("change", browserSync.reload);
}

// HTML

function htmlTask() {
  return gulp
    .src(srcPaths.html)
    .pipe(prettyHtml())
    .pipe(gulp.dest(distPaths.html));
}

function htmlWatcher() {
  console.log(srcPaths.html);
  return gulp
    .watch(srcPaths.html, gulp.parallel(htmlTask, tailwindTask))
    .on("change", browserSync.reload);
}

// tailwindcss
function tailwindTask() {
  return gulp
    .src(srcPaths.tailwind)
    .pipe(sass().on("error", sass.logError))
    .pipe(
      postcss([tailwindcss(srcPaths.tailwindConfig), autoprefixer(), cssnano()])
    )
    .pipe(gulp.dest(distPaths.css))
    .pipe(browserSync.stream());
}

function tailwindWatcher() {
  return gulp
    .watch(srcPaths.tailwind, tailwindTask)
    .on("change", browserSync.reload);
}

// browsersync
function liveReload() {
  browserSync.init({
    server: distPaths.html,
  });
}

exports.default = gulp.parallel(
  liveReload,
  htmlWatcher,
  scssWatcher,
  tailwindWatcher,
  pugWatcher,
  jsWatcher
);
