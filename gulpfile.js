var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var concat = require('gulp-concat');

gulp.task('minifyCSS', function() {
    gulp.src('./src/*.scss')
        // .pipe(concat('all.scss'))
        .pipe(sass().on('error', sass.logError))
        .pipe(minifyCSS({compatibility: 'ie8'}))
        .pipe(rename(function(path){
            path.basename += ".min";
            path.extname = ".css";
        }))
        .pipe(gulp.dest('./dest'))
})

gulp.task('gulp-uglify', function() {
    gulp.src('./src/*.js')
        // .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(rename(function(path) {
            path.basename += ".min";
            path.extname = ".js";
        }))
        .pipe(gulp.dest('./dest'))
})

gulp.task('watch', function() {
    gulp.watch('./src/*.scss', ['minifyCSS']);
    gulp.watch('./src/*.js', ['gulp-uglify']);
})

gulp.task('default', ['watch', 'minifyCSS', 'gulp-uglify'])