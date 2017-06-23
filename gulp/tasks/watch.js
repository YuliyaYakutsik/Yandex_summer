'use strict';

module.exports = function() {
  $.gulp.task('watch', function() {
    $.gulp.watch('./source/blocks/**/*.js', $.gulp.series('js:process'));
    $.gulp.watch('./source/blocks/**/*.scss', $.gulp.series('sass'));
    $.gulp.watch('./source/style/**/*.scss', $.gulp.series('sass'));
    $.gulp.watch('./source/blocks/**/*.pug', $.gulp.series('pug'));
    $.gulp.watch('./source/template/**/*.pug', $.gulp.series('pug'));
  });
};
