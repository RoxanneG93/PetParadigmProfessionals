const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));// setting our own sass
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// Sass Task
function scssTask(){
  return src('app/scss/main.scss', { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([cssnano()]))
    .pipe(dest('dist', { sourcemaps: '.' }));
}

// Webfont Task for icons - need to figure this out laterz if there is time
// function bootstrapFontsTask() {
//     return src('node_modules/bootstrap-icons/font/bootstrap-icons.scss')
//         .pipe(sass())
//         .pipe(postcss([cssnano()]))
//         .pipe(dest('dist', { sourcemaps: '.' }));
// }

// JavaScript Task
function jsTask(){
  return src('app/js/app.js', { sourcemaps: true })
    .pipe(terser())
    .pipe(dest('dist', { sourcemaps: '.' }));
}

// Browsersync Tasks
function browsersyncServe(cb){
  browsersync.init({
    server: {
      baseDir: '.'
    }
  });
  cb();
}

function browsersyncReload(cb){
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask(){
  watch(['*.html', 'app/pages/*.html'], browsersyncReload);
  watch(['app/scss/**/*.scss', 'app/js/**/*.js'], series(scssTask, jsTask, browsersyncReload));
}

// Default Gulp task
exports.default = series(
  scssTask,
  jsTask,
  // bootstrapFontsTask,
  browsersyncServe,
  watchTask
);