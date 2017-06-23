'use strict';

module.exports = function() {
  $.gulp.task('js:process', function() {
    return $.gulp.src($.path.jsProcess)
      .pipe($.gp.sourcemaps.init())
      .pipe($.gp.concat('main.js'))
      .pipe($.gp.if(!$.dev, $.gp.uglify()))
      .pipe($.gp.if($.dev, $.gp.sourcemaps.write()))
      .pipe($.gp.if(!$.dev, $.gp.rename({ suffix: '.min' })))
      .pipe($.gulp.dest($.config.root + '/assets/js'))
  })
};
