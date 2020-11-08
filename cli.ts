#!user/bin/env node

process.argv.push('-f', './node_modules/@brisberg/twine-builder/gulpfile.js')
process.argv.push('--cwd', '.')
console.log(process.argv)
require('./node_modules/.bin/gulp')

console.log('hello from twine-builder cli');
