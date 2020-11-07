import {exec} from 'child_process';
import * as fs from 'fs';
import {dest, series, src} from 'gulp';
import clean from 'gulp-clean';
import concat from 'gulp-concat';
import filter from 'gulp-filter';
import footer from 'gulp-footer';
import header from 'gulp-header';
import gulpif from 'gulp-if';
import * as yaml from 'js-yaml';

import {parseConfig, TwineBuilderConfig} from './config';

const DEFAULT_OUT_DIR = './output';
const DEFAULT_CONFIG_PATH = './example-game/config.yml';

let config: TwineBuilderConfig|null = null;

try {
  let fileContents = fs.readFileSync(DEFAULT_CONFIG_PATH, 'utf8');
  const data = yaml.safeLoad(fileContents);
  config = parseConfig(data);
} catch (e) {
  console.log(e);
}

/** Check if file extension is '.js' */
function isJavaScript(file) {
  return file.extname === '.js';
}

function genHeaderFile(): NodeJS.ReadWriteStream {
  return concatHeaderFile(config.header);
}

/** Concatinates all js and html files for the given glob into single html. */
function concatHeaderFile(
    glob: string|string[], outdir = DEFAULT_OUT_DIR): NodeJS.ReadWriteStream {
  // Append twine-builder standard header
  return src(['header/builder.html'].concat(glob))
      .pipe(filter('**/*.{js,html}'))
      // Wrap naked js files in <script> tags when appended to the header
      .pipe(gulpif(isJavaScript, header('<script>\n')))
      .pipe(gulpif(isJavaScript, footer('</script>')))
      .pipe(concat('head-content.html'))
      .pipe(dest(outdir));
}

function tweego(done: (error?: any) => void) {
  const deps: string[] = [].concat(config.deps)
  const cmd = `tweego --log-files -l \
  --format=${config.format} \
  --head=output/head-content.html \
  -o dist/${config.id}.html \
  ${deps.join(' ')}
  `;
  exec(cmd, function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    done(err);
  });
}

function clear(): NodeJS.ReadWriteStream {
  return src(DEFAULT_OUT_DIR, {read: false, allowEmpty: true}).pipe(clean());
}

const build = series(clear, genHeaderFile, tweego);
build.displayName = 'build';
build.description = 'Compiles the game using Tweego';

export default build;
