'use strict';
module.exports = GulpDir;
function GulpDir() {
  var fs = require('fs'),
    path = require('path'),
    gulp = require('gulp'),
    requireAll = require('require-all'),
    rootDir = process.env.INIT_CWD,
    dir = path.join(rootDir, 'gulp'),
    args = arguments,
    metaTasks = {};

  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    dir = path.join(rootDir, 'gulp.d')
  }

  require('require-all')({
    dirname: dir,
    filter: /^.*\.js$/,
    resolve: resolve
  });

  function resolve(module) {
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

  for (var metaTask in metaTasks) {
    gulp.task(metaTask, metaTasks[metaTask]);
  }
}
