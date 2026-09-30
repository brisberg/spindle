import {dest, src} from 'gulp';
import concat from 'gulp-concat';
import filter from 'gulp-filter';
import footer from 'gulp-footer';
import header from 'gulp-header';
import gulpif from 'gulp-if';
import * as path from 'path';
import Undertaker from 'undertaker';

import {SpindleConfig} from '../config';

/** Check if file extension is '.js' */
function isJavaScript(file: {extname: string;}) {
  return file.extname === '.js';
}

/**
 * Concatenates all js and html files for the given globs into a single html
 * file at `headFile`, for Tweego's --head option.
 */
export default (globs: SpindleConfig['head'], headFile: string):
    Undertaker.TaskFunction => {
  return () => {
    // Append spindle standard headers
    const allGlobs = [`${__dirname}/../../../header/*`].concat(globs);

    return src(allGlobs)
        .pipe(filter('**/*.{js,html}'))
        // Wrap naked js files in <script> tags when appended to the
        // header
        .pipe(gulpif(isJavaScript, header('<script>\n')))
        .pipe(gulpif(isJavaScript, footer('</script>')))
        .pipe(concat(path.basename(headFile)))
        .pipe(dest(path.dirname(headFile)));
  };
}
