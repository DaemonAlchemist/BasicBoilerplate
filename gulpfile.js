'use strict';

var gulp = require('gulp');
var file = require('gulp-file');
var sass = require('gulp-sass');
var uglify = require('gulp-uglifyjs');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var autoprefixer = require('autoprefixer');
var rollup = require('gulp-better-rollup');
var babel = require('rollup-plugin-babel');

gulp.task('js', function () {
    return gulp.src('src/main.js')
        .pipe(sourcemaps.init())
        .pipe(rollup({
            plugins: [
                babel({
                    presets: [
                        ['latest', {
                            es2015: {
                                modules: false
                            }
                        }]
                    ],
                    babelrc: false,
                    exclude: 'node_modules/**'
                })
            ]
        }, {
            format: 'iife'
        }))
        .pipe(uglify())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest('dist'));
});

gulp.task('sass', function () {
    return gulp.src('sass/example.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: [
                'sass',
                'sass/includes'
            ],
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(postcss([ autoprefixer() ]))
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('build', ['sass', 'js']);

gulp.task('watch', function () {
    gulp.watch('src/**/*.js', ['js']);
    gulp.watch('sass/**/*.scss', ['sass']);
});

gulp.task('default', ['watch']);
