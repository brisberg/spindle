import {execFile} from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import {SpindleConfig} from './config';

/** Package root, relative to the compiled dist/ directory. */
const PACKAGE_ROOT = path.join(__dirname, '..');

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

/** Executes the Tweego compiler in a child process. */
function tweego(config: SpindleConfig, headFile: string): Promise<void> {
  // Bundled story formats are searched after any the user already has.
  const storyformatsPath = path.join(PACKAGE_ROOT, 'storyformats');
  const tweegoPath = [process.env.TWEEGO_PATH, storyformatsPath]
                         .filter(Boolean)
                         .join(path.delimiter);

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
        'tweego', args, {env: {...process.env, TWEEGO_PATH: tweegoPath}},
        (err, stdout, stderr) => {
          if ((err as {code?: unknown} | null)?.code === 'ENOENT') {
            return reject(new Error(
                'tweego not found on PATH. See the Spindle README for ' +
                'install instructions.'));
          }
          console.log(stdout);
          console.log(stderr);
          err ? reject(err) : resolve();
        });
  });
}
