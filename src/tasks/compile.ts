import {execFile} from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import Undertaker from 'undertaker';
import {SpindleConfig} from '../config';

/** Compile Task builds the game into `config.out` using Tweego. */
export default function compile(
    config: SpindleConfig, headFile: string): Undertaker.TaskFunction {
  return tweego(config, headFile);
}

/** Execute the Tweego compiler in a child process */
function tweego(
    config: SpindleConfig, headFile: string): Undertaker.TaskFunction {
  return (done: (error?: any) => void) => {
    // Bundled story formats are searched after any the user already has.
    const storyformatsPath = path.join(__dirname, '../../../storyformats');
    const tweegoPath = [process.env.TWEEGO_PATH, storyformatsPath]
                           .filter(Boolean)
                           .join(path.delimiter);

    // Tweego fails if the output directory does not exist.
    fs.mkdirSync(path.dirname(config.out), {recursive: true});

    const args = [
      '--log-files',
      '-l',
      `--head=${headFile}`,
      '-o',
      config.out,
      ...config.src,
    ];
    execFile(
        'tweego', args, {env: {...process.env, TWEEGO_PATH: tweegoPath}},
        (err, stdout, stderr) => {
          if ((err as {code?: unknown} | null)?.code === 'ENOENT') {
            return done(new Error(
                'tweego not found on PATH. See the Spindle README for ' +
                'install instructions.'));
          }
          console.log(stdout);
          console.log(stderr);
          done(err);
        });
  }
}
