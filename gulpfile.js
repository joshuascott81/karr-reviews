const gulp = require('gulp');
const watch = require('gulp-watch');
// const postcss = require('gulp-postcss');
// const autoprefixer = require('autoprefixer');
// const cssvars = require('postcss-simple-vars');
const browserSync = require('browser-sync').create();
const server = require('gulp-express');

// gulp.task('default', function() {

// })

// gulp.task('html', () => {
//     console.log("HTML task")
// })

gulp.task('styles', () => {
    return gulp.src('./assets/css/styles.css')
        .pipe(postcss([
            cssvars,
            autoprefixer
        ]))
        .on('error', function (errorInfo) {
            console.log(errorInfo.toString());
            this.emit('end');
        })
        .pipe(gulp.dest('./public/css'));

})




gulp.task('watch', () => {

    browserSync.init({
        // server: {
        //     baseDir: "./"
        // },
        proxy: "localhost:5000"
    });

    // watch('./index.handlebars', () => {
    //     gulp.start('html');
    // })

    watch('./**/*.css', () => {
        //gulp.start('styles');
        browserSync.reload();
    });

    watch('./**/*.ejs', () => {
        browserSync.reload();
    });

    watch('./**/*.js', () => {
        browserSync.reload();
    });
})