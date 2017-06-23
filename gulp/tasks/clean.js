'use strict';

module.exports = function() {
  $.gulp.task('clean', function(cb) {
    return $.del([$.config.root, './source/style/layout/sprite.scss'], cb);
  });
};