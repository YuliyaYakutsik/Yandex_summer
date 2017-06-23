'use strict';

module.exports = function() {
  $.gulp.task('js:lint', function() {
    return $.gulp.src($.path.jsProcess)
      .pipe($.gp.eslint())
      .pipe($.gp.eslint.format());
  })
};
