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
        'public/css/style.css',
        'public/css/pace-theme.css',
        'public/css/lato-font.css',
        'public/css/normalize.css',
        'public/css/font-awesome.min.css',
        'public/vendor/bootstrap-social/bootstrap-social.css',
        'public/vendor/ng-tags-input/ng-tags-input.css',
        'public/vendor/ngModal/dist/ng-modal.css',
        'public/vendor/angular-tooltips/src/css/angular-tooltips.css',
        'public/vendor/slick-carousel/slick/slick.css',
        'public/vendor/slick-carousel/slick/slick-theme.css',
        'public/vendor/textAngular/dist/textAngular.css'
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
        'public/vendor/jquery/dist/jquery.js',
        'public/vendor/bootstrap/dist/js/bootstrap.min.js',
        'public/vendor/angular-strap/dist/angular-strap.js',
        'public/vendor/angular-strap/dist/angular-strap.tpl.js',
        'public/vendor/angular-messages/angular-messages.js',
        'public/vendor/angular-resource/angular-resource.js',
        'public/vendor/angular-ui-router/release/angular-ui-router.js',
        'public/vendor/angularjs-socialshare/src/js/angular-socialshare.js',
        'public/vendor/ng-tags-input/ng-tags-input.min.js',
        'public/vendor/ngModal/dist/ng-modal.min.js',
        'public/vendor/lodash/dist/lodash.min.js',
        'public/vendor/angular-sanitize/angular-sanitize.js',
        'public/vendor/angular-carousel/dist/angular-carousel.min.js',
        'public/vendor/angular-touch/angular-touch.min.js',
        'public/vendor/angular-tooltips/src/js/angular-tooltips.js',
        'public/vendor/angular-validation-match/dist/angular-input-match.min.js',
        'public/vendor/angular-slick/dist/slick.min.js',
        'public/vendor/slick-carousel/slick/slick.min.js',
        'public/vendor/textAngular/dist/textAngular-rangy.min.js',
        'public/vendor/textAngular/dist/textAngular.min.js',
        'public/js/retina-1.1.0.min.js',
        'public/js/jquery.easing.1.3.js',
        'public/js/jquery.animate-enhanced.min.js',
        'public/js/jquery.superslides.js',
        'public/app.js',
        'public/services/*.js',
        'public/controllers/*.js',
        'public/filters/*.js',
        'public/directives/*.js'
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
