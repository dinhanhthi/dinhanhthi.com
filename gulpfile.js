var gulp = require('gulp');
var responsive = require('gulp-responsive');
var imagemin = require("gulp-imagemin");
var cache = require('gulp-cache'); // 1-1

function generateSizes() {
    return gulp
        .src('./img_src/**/*.{png,jpg}')
        .pipe(
            responsive({
                // Resize all JPG images to three different sizes: 200, 500, and 630 pixels
                '**/*': [{
                    width: 320,
                    rename: { suffix: '-320' },
                }, {
                    width: 550,
                    rename: { suffix: '-550' },
                }, {
                    // Compress, strip metadata
                }],
            }, {
                quality: 90,
                progressive: true,
                withMetadata: false,
                withoutEnlargement: true,
                errorOnUnusedImage: false,
                errorOnEnlargement: false
            })
        )
        .pipe(gulp.dest('./img'));
}

function imgCompress() {
    return gulp
        .src('./img/**/*.{png,jpg}')
        .pipe(cache(imagemin()))
        .pipe(gulp.dest("./img"));
}

gulp.task('imgCompress', imgCompress);
gulp.task('generateSizes', generateSizes);
// gulp.task("compressImg", gulp.series("imgCompress", "watch"));
gulp.task("watch", () => {
    gulp.watch("./img_src/**/*.{png,jpg}", imgCompress);
    gulp.watch("./img_src/**/*.{png,jpg}", generateSizes);
})

gulp.task("build", gulp.series("generateSizes", "imgCompress"));