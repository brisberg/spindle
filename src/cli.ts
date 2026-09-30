#!/usr/bin/env node

import {parseArgs} from 'util';

import {build} from './build';
import {loadConfig} from './config';

async function main(): Promise<void> {
  let config;
  try {
    const {values} = parseArgs({
      options: {
        config: {type: 'string', short: 'c'},
      },
    });
    config = loadConfig(values.config);
  } catch (e) {
    console.error(`Spindle config error: ${e.message}`);
    process.exitCode = 1;
    return;
  }

  try {
    await build(config);
  } catch (e) {
    console.error(`Spindle Build failed: ${e.message}`);
    process.exitCode = 1;
    return;
  }

  console.log('Spindle Build finished');
}

main();
