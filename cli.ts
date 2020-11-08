#!/usr/bin/env node

import cp from 'child_process';

const gulpCmd = ` \
gulp \
  --cwd . \
  -f ./node_modules/@brisberg/spindle/dist/gulpfile.js \
`;
cp.exec(gulpCmd, (err, stdout, stderr) => {
  console.log(stdout);
  console.log(stderr);
});
