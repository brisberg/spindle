import fs from 'fs';
import {dest, src} from 'gulp';
import concat from 'gulp-concat';
import filter from 'gulp-filter';
import footer from 'gulp-footer';
import header from 'gulp-header';
import gulpif from 'gulp-if';
import Undertaker from 'undertaker';

import {DEFAULT_OUT_DIR, SpindleConfig} from '../config';

/** Check if file extension is '.js' */
function isJavaScript(file: {extname: string;}) {
  return file.extname === '.js';
}

/** Concatenates all js and html files for the given glob into single html. */
function concatHeaderFile(
    glob: string|string[], outdir: string): Undertaker.TaskFunction {
  return () => {
    // Append twine-builder standard headers
    const globs = [`${__dirname}/../../../header/*`].concat(glob);

    return src(globs)
        .pipe(filter('**/*.{js,html}'))
        // Wrap naked js files in <script> tags when appended to the
        // header
        .pipe(gulpif(isJavaScript, header('<script>\n')))
        .pipe(gulpif(isJavaScript, footer('</script>')))
        .pipe(concat('head-content.html'))
        .pipe(dest(outdir));
  };
}

/** Concatenates all js and html files for the given glob into single html. */
export default (globs: SpindleConfig['header'], outdir = DEFAULT_OUT_DIR):
    Undertaker.TaskFunction => {
  // Create output dir
  if (!fs.existsSync(outdir)) {
    fs.mkdirSync(outdir);
  }
  return concatHeaderFile(globs, outdir);
}
