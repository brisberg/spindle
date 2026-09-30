import * as fs from 'fs';
import gulp from 'gulp';
import * as yaml from 'js-yaml';

import {DEFAULT_CONFIG_PATH, DEFAULT_OUT_DIR, parseConfig, SpindleConfig} from './src/config';
import clearTask from './src/tasks/clear'
import compileTask from './src/tasks/compile';
import generateHeader from './src/tasks/header';

const argv = require('minimist')(process.argv.slice(2));
// console.log(argv)
const configPath = argv['c'] || DEFAULT_CONFIG_PATH;
let config: SpindleConfig;

try {
  const fileContents = fs.readFileSync(configPath, 'utf8');
  const data = yaml.safeLoad(fileContents);
  config = parseConfig(data);
} catch (e) {
  console.error(`Spindle failed to load config '${configPath}': ${e.message}`);
  process.exit(1);
}


// TODO: Pass in out dir from a config
const genHeader = generateHeader(config.header, DEFAULT_OUT_DIR)

// TODO: Pass in out dir from a config
const compile = compileTask(config, DEFAULT_OUT_DIR);
compile.displayName = 'compile';
compile.description = 'Compiles the game using Tweego'

// TODO: Pass in out dir from a config
export const clear = clearTask(DEFAULT_OUT_DIR);
clear.displayName = 'clear';
clear.description = 'Removes all files from the output directory'

export const build = gulp.series(genHeader, compile);
build.displayName = 'build';
build.description = 'Builds a full Twine Game';

gulp.task('spindle', gulp.series(clear, build));
