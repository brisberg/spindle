import {execFile} from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import {SpindleConfig} from './config';

/** Always inserted at the top of the <head>. */
const BUILDER_META = '<meta name="build-tool" content="spindle" />\n';

/**
 * Builds the game: removes the previous output, assembles the <head> content,
 * and compiles with Tweego.
 */
export async function build(config: SpindleConfig): Promise<void> {
  // Remove only the output file, never its directory, since `out` may point
  // anywhere in the user's repo. A failed build then leaves no stale game.
  fs.rmSync(config.out, {force: true});
  // Tweego fails if the output directory does not exist.
  fs.mkdirSync(path.dirname(config.out), {recursive: true});

  // Generated head content is an intermediate file, kept out of the output dir.
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'spindle-'));
  try {
    const headFile = path.join(tmpDir, 'head-content.html');
    fs.writeFileSync(headFile, buildHead(config.head));
    await tweego(config, headFile);
  } finally {
    fs.rmSync(tmpDir, {recursive: true, force: true});
  }
}

/**
 * Concatenates all .html and .js files matched by `globs` into a single HTML
 * fragment. JS files are wrapped in <script> tags.
 */
export function buildHead(globs: string[]): string {
  const files = new Set<string>();
  for (const glob of globs) {
    const matches = fs.globSync(glob)
                        .filter((f) => /\.(js|html)$/.test(f))
                        .filter((f) => fs.statSync(f).isFile())
                        .sort();
    matches.forEach((f) => files.add(f));
  }

  const parts = [BUILDER_META];
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    parts.push(
        path.extname(file) === '.js' ? `<script>\n${content}</script>` :
                                       content);
  }
  return parts.join('\n');
}

/** Matches Tweego's errors for missing story formats or search directories. */
const MISSING_FORMAT_ERROR = /^error: Story format/m;

/** Executes the Tweego compiler in a child process. */
function tweego(config: SpindleConfig, headFile: string): Promise<void> {
  const args = [
    '--log-files',
    '-l',
    `--head=${headFile}`,
    '-o',
    config.out,
    ...config.src,
  ];

  return new Promise((resolve, reject) => {
    execFile(
        'tweego', args, (err, stdout, stderr) => {
          if ((err as {code?: unknown} | null)?.code === 'ENOENT') {
            return reject(new Error(
                'tweego not found on PATH. See the Spindle README for ' +
                'install instructions.'));
          }
          console.log(stdout);
          console.log(stderr);
          if (err && MISSING_FORMAT_ERROR.test(stderr)) {
            return reject(new Error(
                'Tweego could not find your story format. Add it to a ' +
                'storyformats/ directory in your project (see "Story formats" ' +
                'in the Spindle README).'));
          }
          err ? reject(err) : resolve();
        });
  });
}
