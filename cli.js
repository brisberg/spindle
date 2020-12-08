#!/usr/bin/env node

import gulp from 'gulp';
import './gulpfile';

// Programatically execute gulp task
// https://github.com/gulpjs/gulp/issues/770#issuecomment-501266124
gulp.task('spindle')((err) => {
  if (err) {
    console.error('Spindle Build failed: ' + err.message);
    return;
  }

  console.log('Spindle Build finished');
  return;
})
