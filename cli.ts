#!/usr/bin/env node

import cp from 'child_process';

const gulpCmd = ` \
gulp \
  --cwd . \
  -f ./node_modules/@brisberg/twine-builder/dist/gulpfile.js \
`;
cp.exec(gulpCmd, (err, stdout, stderr) => {
  console.log(stdout);
  console.log(stderr);
});
