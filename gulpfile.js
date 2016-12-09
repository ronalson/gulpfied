var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var responsiveImages = require ('gulp-responsive');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');

/*  EXEMPLE OF GULP TASK
// ---------------------

    gulp.task('task-name', function () {
      return gulp.src('source-files') // Get source files with gulp.src
        .pipe(aGulpPlugin()) // Sends it through a gulp plugin
        .pipe(gulp.dest('destination')) // Outputs the file in the destination folder
    })

// ---------------------
*/

// Development Tasks
// -----------------

// Start browserSync server
gulp.task('server', function () {
  // Starts a server from the root folder
  browserSync.init ({
    server: {
      baseDir: 'dev'
    }
  });
});

// Compile Sass & run autoprefixer
gulp.task('styles', function () {
  return gulp.src('dev/scss/**/*.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest('dev/css'))
    .pipe(browserSync.reload({ stream: true }));
});

// Watchers Tasks
gulp.task('watch', function() {
  gulp.watch('dev/scss/**/*.scss', ['styles']);
  gulp.watch('dev/*.html').on('change', browserSync.reload);
  gulp.watch('dev/js/**/*.js').on('change', browserSync.reload);
});

// // Responsive images Tasks
// // -----------------------
// // ATENTION!
// // Make sure the responsive images output fits the project needs
//
// gulp.task('responsive', function (){
//   return gulp.src('src-images/**/*.+(png|jpg|jpeg)')
//     .pipe(resposiveImages({
//       '*.jpg': [
//         {
//         width: 300,
//         rename: { suffix: '-small' },
//       }, {
//         width: 600,
//         rename: { suffix: '-medium' },
//       }, {
//         width: 1200,
//         rename: { suffix: '-large' },
//       }],
//       '*.png': [
//         {
//         width: 250,
//       }, {
//         width: 250 * 2,
//         rename: { suffix: '@2x' },
//       }
//       ]
//     },
//     {
//       // Global configuration for all images
//       // The output quality for JPEG, WebP and TIFF output formats
//       quality: 30,
//       // Use progressive (interlace) scan for JPEG and PNG output
//       progressive: true,
//       // Strip all metadata
//       withMetadata: false,
//       // Do not emit the error when image is enlarged.
//       errorOnEnlargement: false,
//     }))
//     .pipe(gulp.dest('dev/images'));
// });


// Optimization Tasks
// -----------------

// Optimizing CSS and JavaScript
gulp.task('useref', function() {

  return gulp.src('dev/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'));
});

// Optimizing Images
gulp.task('images', function() {
  return gulp.src('dev/images/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching images that ran through imagemin
    .pipe(cache(imagemin({
      interlaced: true,
    })))
    .pipe(gulp.dest('dist/images'));
});

// Copying fonts
gulp.task('fonts', function() {
  return gulp.src('dev/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});

// Cleaning
gulp.task('clean', function() {
  return del.sync('dist').then(function(cb) {
    return cache.clearAll(cb);
  });
});

gulp.task('clean:dist', function() {
  return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

// Build Squences
// -----------------

// Default Task
gulp.task('default', function(callback) {
  runSequence(['styles', 'server'], 'watch',
    callback
  );
});

// Build Task
gulp.task('build', function(callback) {
  runSequence(
    'clean:dist',
    'sass',
    ['useref', 'images', 'fonts'],
    callback
  );
});
