var gulp = require('gulp');
var gutil = require('gulp-util');
var php2html = require("gulp-php2html");
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sass = require('gulp-ruby-sass');
var coffee = require('gulp-coffee');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
require('gulp-grunt')(gulp);

var DEST = 'assets/';
gulp.task('coffee', function () {
    console.log('----- compiling coffee scripts');
    gulp.src('./src/coffee/main.coffee')
            .pipe(coffee({bare: true}).on('error', gutil.log))
            .pipe(gulp.dest('./src/js/'));
});
gulp.task('scripts', function () {
    console.log('---- compiling JavaScripts');
    return gulp.src('./src/js/*.js')
            .pipe(concat('main.js'))
            .pipe(gulp.dest(DEST + '/js'))
            .pipe(rename({suffix: '.min'}))
            .pipe(uglify())
            .pipe(gulp.dest(DEST + '/js'))
            .pipe(browserSync.stream());
});
var compileSASS = function (filename, options) {
    console.log('---- compiling SASS');
    return sass('src/scss/main.scss', options)
            .pipe(autoprefixer('last 2 versions', '> 5%'))
            .pipe(concat(filename))
            .pipe(gulp.dest(DEST + '/css'))
            .pipe(browserSync.stream());
};
gulp.task('sass', function () {
    return compileSASS('main.css', {});
});
gulp.task('sass-minify', function () {
    return compileSASS('main.min.css', {style: 'compressed'});
});
gulp.task('php2html', function () {
    console.log('---- compiling PHP to HTML');
    gulp.src("./src/php/*.php")
            .pipe(php2html())
            .pipe(gulp.dest("./dist"));
})
gulp.task('browser-sync', function () {
    console.log('---- starting browser-sync');
    browserSync.init({
        server: {
            baseDir: './'
        },
        startPath: './dist/index.html'
    });
});
gulp.task('reload', function () {
    console.log('---- reloading browser');
    browserSync.reload();
})
gulp.task('watch', function () {
    console.log('starting default watch');
    // Watch .html files
    gulp.watch('dist/*.html', ['reload']);
    // Watch .coffee files
    gulp.watch('src/coffee/**/*.js',['coffee']);
    // Watch .js files
    gulp.watch('src/js/**/*.js', ['scripts']);
    // Watch .scss files
    gulp.watch('src/scss/**/*.scss', ['sass', 'sass-minify']);
});
gulp.task('php-watch', function () {
    console.log('starting PHP watch');
    // Watch .php files
    gulp.watch('src/php/**/*.php', ['php2html', 'reload']);
    // Watch .coffee files
    gulp.watch('src/coffee/**/*.js',['coffee']);
    // Watch .js files
    gulp.watch('src/js/**/*.js', ['scripts']);
    // Watch .scss files
    gulp.watch('src/scss/**/*.scss', ['sass', 'sass-minify']);
});
// Default Task
gulp.task('default', ['browser-sync', 'watch']);
gulp.task('php-mode', ['browser-sync', 'php-watch']);
