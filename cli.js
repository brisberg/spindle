#!/usr/bin/env node

import gulp from 'gulp';
import './gulpfile';

// Undertaker re-emits task errors as 'error' events, which crash the process
// if unhandled. Errors are reported by the task callback below instead.
gulp.on('error', () => {});

// Programatically execute gulp task
// https://github.com/gulpjs/gulp/issues/770#issuecomment-501266124
gulp.task('spindle')((err) => {
  if (err) {
    console.error('Spindle Build failed: ' + err.message);
    process.exitCode = 1;
    return;
  }

  console.log('Spindle Build finished');
  return;
})
