const gulp = require('gulp');
const concat = require('gulp-concat');
const del = require('del');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const autoprefix = require('gulp-autoprefixer');
const config = {
    server: {
        baseDir: "./build"
    },
    tunnel: false,
    host: 'localhost',
    port: 3333
};

function htmlBuild() {
    return gulp.src('src/*.html')
        .pipe(gulp.dest('build/'));
}
gulp.task('html', htmlBuild);

gulp.task('scripts', function () {
    return gulp.src('src/js/plugins/*.js')
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('build/js/'))
        .pipe(browserSync.stream());
});
gulp.task('scriptsDev', function () {
    return gulp.src('src/js/*.js')
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('build/js/'))
        .pipe(browserSync.stream());
});

gulp.task('clearBuild', function () {
    return del(['build/*'])
});
//сборка css
gulp.task('css', function () {
    return gulp.src(['node_modules/normalize.css/normalize.css', 'src/scss/**/*.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('styles.css'))
        .pipe(autoprefix({
            grid: true,
            browsers: ['> 0.1%', 'ie 10-11', 'Firefox > 20'],
            cascade: false
        }))
        .pipe(gulp.dest('build/css/'))
        .pipe(browserSync.stream());
});
gulp.task('img', function () {
    return gulp.src('src/img/**/*.*')
        .pipe(gulp.dest('build/img/'));
});
gulp.task('fonts', function () {
    return gulp.src('src/fonts/**/*.*')
        .pipe(gulp.dest('build/fonts/'));
});
gulp.task('watch', function () {
    browserSync.init(config);
    gulp.watch('src/scss/*.scss', gulp.series('css'));
    gulp.watch('src/js/plugins/*.js', gulp.series('scripts'));
    gulp.watch('src/js/*.js', gulp.series('scriptsDev'));
    gulp.watch('src/*.html', gulp.series('html')).on('change', browserSync.reload);
});

gulp.task('build',
    gulp.series(
        'clearBuild',
        gulp.parallel('html', 'scripts', 'scriptsDev', 'css', 'fonts', 'img')
    )
);

gulp.task('default', gulp.series('build', 'watch'));