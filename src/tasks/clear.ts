import {src} from 'gulp';
import clean from 'gulp-clean';
import Undertaker from 'undertaker';
import {DEFAULT_OUT_DIR} from '../config';

function clear(outdir: string): Undertaker.TaskFunction {
  return () => src(outdir, {read: false, allowEmpty: true}).pipe(clean());
}

/** Clear Task removes all files from the out directory */
export default (outdir = DEFAULT_OUT_DIR): Undertaker.TaskFunction => {
  return clear(outdir);
}
