import {exec} from 'child_process';
import * as path from 'path';
import Undertaker from 'undertaker';
import {DEFAULT_OUT_DIR, TwineBuilderConfig} from '../config';

/** Clear Task removes all files from the out directory **/
export default function compile(
    config: TwineBuilderConfig,
    outdir = DEFAULT_OUT_DIR): Undertaker.TaskFunction {
  return tweego(config, outdir);
}

/** Execute the Tweego compiler in a child process */
function tweego(
    config: TwineBuilderConfig, outdir: string): Undertaker.TaskFunction {
  return (done: (error?: any) => void) => {
    const storyformatsPath = path.join(__dirname, '../../storyformats');
    const deps: string[] = [].concat(config.deps);
    const cmd = `\
    export TWEEGO_PATH=${storyformatsPath}
    go run github.com/tmedwards/tweego --log-files -l \
    --format=${config.format} \
    --head=${outdir}/head-content.html \
    -o ${outdir}/${config.id}.html \
    ${deps.join(' ')}
    `;
    exec(cmd, (err, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      done(err);
    });
  }
}
