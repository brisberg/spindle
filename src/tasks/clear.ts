import * as fs from 'fs';
import Undertaker from 'undertaker';

/**
 * Clear Task removes the previous build output, so a failed build does not
 * leave a stale game behind. Only the output file is removed, never its
 * directory, since `out` may point anywhere in the user's repo.
 */
export default (outFile: string): Undertaker.TaskFunction => {
  return (done) => {
    fs.rmSync(outFile, {force: true});
    done();
  };
}
