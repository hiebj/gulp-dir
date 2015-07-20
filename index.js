'use strict';
module.exports = GulpDir;
function GulpDir(dir, args) {
  var fs = require('fs'),
    util = require('util'),
    path = require('path'),
    gulp = require('gulp'),
    requireAll = require('require-all'),
    metaTasks = {};

  require('require-all')({
    dirname: dir,
    filter: /^.*\.js$/,
    resolve: resolve
  });

  function resolve(module) {
    if (module) {
      if (typeof module === 'function') {
        if (!args) {
          args = [];
        }
        if (!util.isArray(args)) {
          args = [args];
        }
        module = module.apply(module, args);
      }
      for (var metaTask in module) {
        metaTasks[metaTask] = metaTasks[metaTask] || [];
        
        var tasks = module[metaTask];
        if (!util.isArray(tasks)) {
          tasks = [tasks];
        }

        tasks.forEach(function(task){
          metaTasks[metaTask].push(task);
        });
      }
    }
  }

  for (var metaTask in metaTasks) {
    gulp.task(metaTask, metaTasks[metaTask]);
  }
}
