var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');

var notifier = require('node-notifier');
var server = require('gulp-server-livereload');
var watch = require('gulp-watch');
var sass = require('gulp-sass');

var react = require('gulp-react');
var concat = require('gulp-concat');

var notify = function(error) {
  var message = 'In: ';
  var title = 'Error: ';

  if(error.description) {
    title += error.description;
  } else if (error.message) {
    title += error.message;
  }

  if(error.filename) {
    var file = error.filename.split('/');
    message += file[file.length-1];
  }

  if(error.lineNumber) {
    message += '\nOn Line: ' + error.lineNumber;
  }

  notifier.notify({title: title, message: message});
};

var bundler = watchify(browserify({
  entries: ['./src/app.jsx'],
  transform: [reactify],
  extensions: ['.jsx'],
  debug: true,
  cache: {},
  packageCache: {},
  fullPaths: true
}));

function bundle(){
  return bundler
    .bundle()
    .on('error', notify)
    .pipe(source('main.js'))
    .pipe(gulp.dest('./'));
}

bundler.on('update', bundle);

gulp.task('build', function(){
    bundle();
});

// gulp.task('serve', function(done) {
//   gulp.src('.')
//     .pipe(server({
//       livereload: {
//         enable: true,
//         filter: function(filePath, cb) {
//           if(/main.js/.test(filePath)) {
//             cb(true)
//           } else if(/style.css/.test(filePath)){
//             cb(true)
//           }
//         }
//       },
//       open: false
//     }));
// });

gulp.task('sass', function () {
  gulp.src('./css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./css/'));
});

gulp.task('watch', function () {
  gulp.watch('./css/*.scss', ['sass']);
});

gulp.task("default", ["watch", "sass", "build"])

// gulp.task("default", function(){
//   return gulp.src('src/**')
//     .pipe(react())
//     .pipe(concat('js/application.js'))
//     .pipe(gulp.dest('./'))
// });

