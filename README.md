# gulp-dir

A simple tool that allows you to split up your [Gulp](http://gulpjs.com/) build script into several concise modules. It also provides a convenient interface to create meta-tasks (task groups).

## Install

```
$ npm install gulp-dir
```

## Usage

```javascript
require('gulp-dir')();
```

**gulp-dir** loads modules out of a subdirectory, named either `gulp/` or `gulp.d/`. This allows you to create very concise and modular build scripts. The approach is similar to the *nix `conf.d/` configuration directory pattern. Typically, each of these files will contain a small number of related task definitions; for example, one task module might contain **lint**, **watch** and **all** tasks for your app's JavaScript code, while another would contain tasks for your LESS/CSS.

All that is required to add a script to the build is to drop it into the directory and re-run your Gulp build. **gulp-dir** will automatically find the new script and incorporate it in the build process.

## Meta-Tasks (task groups)

Meta-tasks are simply wrapper tasks that depend on several other tasks, effectively creating a task group. Multiple meta-tasks can be created, and each module can contribute one task to each meta-task. To register a task as part of a meta-task, a module should export an object mapping the name of the target meta-task to the name of the defined subtask:

Task module:
```javascript
var gulp = require('gulp');  
gulp.task('app:lint', ...);  
gulp.task('app', ... );  
gulp.task('app:watch', ... );  
module.exports = {  
  all: 'app',  
  watch: 'app:watch'  
};
```

In the above example, the **app** task defined in the task module will be used as a dependency when defining the **all** meta-task. Likewise, the **app:watch** task will be used as a dependency for the **watch** meta-task. It is not necessary for all of your tasks to join meta-tasks.

Meta-tasks are functionally no different from normal tasks. They are executed in the same way as any other Gulp task:

```shell
$ gulp all  
$ gulp watch
```

Meta-tasks can also be wrapped further into top-level tasks:

```javascript
var gulp = require('gulp');  
require('gulp-dir')();  
gulp.task('default', ['all', 'watch']);  
gulp.task('production', ['all']);
```

Note that if you create a meta-task called **default** it will be run when you execute `gulp` with no arguments.

## Parameters

If you want to pass flags (e.g. production) or other parameters to your modules, simply pass those parameters to the main gulp-dir module function. To consume the parameters within a module, export a function rather than an object literal. The parameters will be passed through:

gulpfile.js:
```javascript
require('gulp-dir')({  
  production: true  
});
```

Task module:
```javascript
var gulp = require('gulp');  
module.exports = function(flags) {  
  gulp.task('app:lint', ...);  
  gulp.task('app', ... );  
  gulp.task('app:watch', ... );  
  console.log(flags.production); // prints 'true'  
  return {  
    all: 'app',  
    watch: 'app:watch'  
  }  
};
```

Parameters of any type can be used; they are passed as-is using `module.apply(module, arguments)`.

Just like typical Gulp usage, if you want a meta-task to wait for the completion of one of its subtasks, follow the asynchronous task hinting rules as described in the [Gulp api docs](https://github.com/gulpjs/gulp/blob/master/docs/API.md#async-task-support). All the subtasks within a meta-task will be executed concurrently, but the meta-task will wait for blocking subtasks before exiting.

It is possible to make a task in one module depend on a task in another module. Since all the tasks are defined by your scripts, any task can depend on any other task like normal.