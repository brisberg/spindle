#!user/bin/env node

const fs = require('fs');

process.argv.push('-f', './node_modules/@brisberg/twine-builder/gulpfile.js')
process.argv.push('--cwd', '.')
console.log(process.argv)
require('./node_modules/.bin/gulp')

console.log("hello from twine-builder cli");

// const { exec } = require('child_process');

// const cmd = "yarn run gulp";
// exec(cmd, function (err, stdout, stderr) {
//   console.log(stdout);
//   console.log(stderr);
// });
