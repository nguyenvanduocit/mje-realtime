var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require('gulp-uglify');
var gulpFilter = require("gulp-filter");
var pipe = require("gulp-pipe");
var compass =require("gulp-compass");
var autoprefixer = require('gulp-autoprefixer');

var watch = require('gulp-watch');
var batch = require('gulp-batch');
var browserSync = require('browser-sync').create();

var sassFiles = "./src/sass/**.*scss";
gulp.task('sass', function () {
    return pipe([
        gulp.src(sassFiles),
        compass({
            css: './css',
            sass: './src/sass',
            image: './images'
        }),
        autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }),
        gulp.dest('./css'),
        browserSync.stream()
    ]);
});

var jsPartialsFiles = [
    './src/js/partials/*.js'
];

gulp.task('js.partials', function () {
    return pipe([
        gulp.src(jsPartialsFiles),
        uglify(),
        gulp.dest('./js'),
        browserSync.stream()
    ]);
});

var jsMergableFiles = [
    './src/js/mergable/*.js'
];
gulp.task('js.mergable', function () {
    return pipe([
        gulp.src(jsMergableFiles),
        concat("script.js"),
        gulp.dest('./js'),
        browserSync.stream()
    ]);
});

gulp.task('vendor', function () {
    var jsFilter = gulpFilter("**/*.js", {restore: true});
    var cssFilter = gulpFilter("**/*.css", {restore: true});
    var extraJs = [
        './src/lib/**/*.js'
    ];
    var extraCss = [
        './src/lib/**/*.css'
    ];
    return pipe([
        gulp.src(extraJs.concat(extraCss)),
        cssFilter,
        concat('vendor.css'),
        //minifyCSS(),
        gulp.dest('./css'),
        cssFilter.restore,
        jsFilter,
        concat('vendor.js'),
        //uglify(),
        gulp.dest('./js'),
        browserSync.stream()
    ]);
});

gulp.task('watch', function () {

    browserSync.init({
        proxy: "mje.dev",
        open:false
    });

    var templateFiles =['**/*.php'];
    watch(templateFiles).on('change', browserSync.reload);

    watch(sassFiles, batch(function (events, done) {
        gulp.start('sass', done);
    }));

    watch(jsPartialsFiles, batch(function (events, done) {
        gulp.start('js.partials', done);
    }));

    watch(jsMergableFiles, batch(function (events, done) {
        gulp.start('js.mergable', done);
    }));

});

gulp.task('default', [ "sass", "vendor", "js.partials", "js.mergable"]);
