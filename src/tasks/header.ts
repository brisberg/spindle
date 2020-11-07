import {dest, src, task} from 'gulp';
import concat from 'gulp-concat';
import filter from 'gulp-filter';
import footer from 'gulp-footer';
import header from 'gulp-header';
import gulpif from 'gulp-if';
import Undertaker from 'undertaker';
import {DEFAULT_OUT_DIR, TwineBuilderConfig} from '../config';

/** Check if file extension is '.js' */
function isJavaScript(file) {
  return file.extname === '.js';
}

/** Concatinates all js and html files for the given glob into single html. */
function concatHeaderFile(
    glob: string|string[], outdir: string): Undertaker.TaskFunction {
  return () => {
    // Append twine-builder standard header
    return src(['header/'].concat(glob))
        .pipe(filter('**/*.{js,html}'))
        // Wrap naked js files in <script> tags when appended to the
        // header
        .pipe(gulpif(isJavaScript, header('<script>\n')))
        .pipe(gulpif(isJavaScript, footer('</script>')))
        .pipe(concat('head-content.html'))
        .pipe(dest(outdir));
  };
}

/** Concatinates all js and html files for the given glob into single html. */
export default (globs: TwineBuilderConfig['header'], outdir = DEFAULT_OUT_DIR):
    Undertaker.TaskFunction => {
  return concatHeaderFile(globs, outdir);
}
