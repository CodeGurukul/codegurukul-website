var gulp = require('gulp');
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var minifyCSS = require('gulp-minify-css');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var nodemon = require('gulp-nodemon');

var jade = require('jade');
var gulpJade = require('gulp-jade');
var katex = require('katex');

var templateCache = require('gulp-angular-templatecache');
var autoprefixer = require('gulp-autoprefixer');

var onError = function (err) {  
    console.log(err);
};

gulp.task('css', function(){
    gulp.src([
        'public/css/style.css'
    ])
        .pipe(plumber({
        errorHandler: onError
    }))
        .pipe(minifyCSS())
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('public'))
});


gulp.task('compress', function() {
    gulp.src([
        'public/vendor/angular/angular.js',
        'public/vendor/angular-resource/angular-resource.js',
        'public/vendor/angular-ui-router/release/angular-ui-router.js',
        'public/app.js'
    ])
        .pipe(plumber({
        errorHandler: onError
    }))
        .pipe(concat('app.min.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('public'));
});

gulp.task('templates', function() {
    gulp.src('public/views/**/*.html')
        .pipe(templateCache({ root: 'views', module: 'Codegurukul' }))
        .pipe(gulp.dest('public'));
});


gulp.task('develop', function () {
    nodemon({ script: 'server.js' })
        .on('restart', function () {
        console.log('restarting server')
    })
})

gulp.task('watch', function() {
    gulp.watch('public/views/**/*.html', ['templates']);
    gulp.watch(['public/**/*.js', '!public/app.min.js', '!public/templates.js', '!public/vendor'], ['compress']);
});

gulp.task('default', ['css','compress', 'templates', 'develop', 'watch']);
gulp.task('nocss', ['compress', 'templates', 'develop', 'watch']);
