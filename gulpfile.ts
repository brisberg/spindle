import * as fs from 'fs';
import gulp from 'gulp';
import * as os from 'os';
import * as path from 'path';

import {loadConfig, SpindleConfig} from './src/config';
import clearTask from './src/tasks/clear'
import compileTask from './src/tasks/compile';
import generateHeader from './src/tasks/header';

const argv = require('minimist')(process.argv.slice(2));
let config: SpindleConfig;

try {
  config = loadConfig(argv['c']);
} catch (e) {
  console.error(`Spindle config error: ${e.message}`);
  process.exit(1);
}

// Generated head content is an intermediate file, kept out of the output dir.
const headFile = path.join(
    fs.mkdtempSync(path.join(os.tmpdir(), 'spindle-')), 'head-content.html');

const genHeader = generateHeader(config.head, headFile);

const compile = compileTask(config, headFile);
compile.displayName = 'compile';
compile.description = 'Compiles the game using Tweego'

export const clear = clearTask(config.out);
clear.displayName = 'clear';
clear.description = 'Removes the previous build output'

export const build = gulp.series(genHeader, compile);
build.displayName = 'build';
build.description = 'Builds a full Twine Game';

gulp.task('spindle', gulp.series(clear, build));
