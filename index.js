'use strict';
module.exports = GulpDir;
function GulpDir() {
  var fs = require('fs'),
    path = require('path'),
    gulp = require('gulp'),
    dir = path.join(__dirname, 'gulp'),
    args = arguments,
    metaTasks = {};

  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    dir = path.join(__dirname, 'gulp.d')
  }

  fs.readdirSync(dir).forEach(loadGulpModule);
  function loadGulpModule(module) {
    var fullpath;
    if (module.match(/^.*\.js$/)) {
      fullpath = path.join(dir, module);
      module = require(fullpath);
      if (module) {
        if (typeof module === 'function') {
          module = module.apply(module, args);
        }
        for (var metaTask in module) {
          metaTasks[metaTask] = metaTasks[metaTask] || [];
          metaTasks[metaTask].push(module[metaTask]);
        }
      }
    }
  }

  for (var metaTask in metaTasks) {
    gulp.task(metaTask, metaTasks[metaTask]);
  }
}
