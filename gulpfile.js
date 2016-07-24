var gulp = require('gulp');
var php2html = require("gulp-php2html");
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();

// import grunt script
require('gulp-grunt')(gulp);

var DEST = 'assets/';

gulp.task('scripts', function () {
    return gulp.src('src/js/*.js')
            .pipe(concat('custom.js'))
            .pipe(gulp.dest(DEST + '/js'))
            .pipe(rename({suffix: '.min'}))
            .pipe(uglify())
            .pipe(gulp.dest(DEST + '/js'))
            .pipe(browserSync.stream());
});

// TODO: Maybe we can simplify how sass compile the minify and unminify version
var compileSASS = function (filename, options) {
    return sass('src/scss/*.scss', options)
            .pipe(autoprefixer('last 2 versions', '> 5%'))
            .pipe(concat(filename))
            .pipe(gulp.dest(DEST + '/css'))
            .pipe(browserSync.stream());
};
gulp.task('sass', function () {
    return compileSASS('custom.css', {});
});

gulp.task('sass-minify', function () {
    return compileSASS('custom.min.css', {style: 'compressed'});
});
gulp.task('compile-php', function () {
    gulp.src("./src/php/*.php")
            .pipe(php2html())
            .pipe(gulp.dest("./dist"));
})
gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: './'
        },
        startPath: './dist/index.html'
    });
});
gulp.task('watch', function () {
    // Watch .html files
    gulp.watch('dist/*.html', browserSync.reload);
    // Watch .php files
    gulp.watch('src/php/**/*.php',['compile-php']);
    // Watch .js files
    gulp.watch('src/js/*.js', ['scripts']);
    // Watch .scss files
    gulp.watch('src/scss/*.scss', ['sass', 'sass-minify']);
});
// Default Task
gulp.task('default', ['browser-sync', 'watch']);
