import * as fs from 'fs';
import {dest, parallel, src} from 'gulp';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import * as yaml from 'js-yaml';

let data: any = {head: []};
try {
  let fileContents = fs.readFileSync('./example.yml', 'utf8');
  data = yaml.safeLoad(fileContents);

  console.log(data);
} catch (e) {
  console.log(e);
}

function concatHeaderFile(): NodeJS.ReadWriteStream {
  return src(data.head, {allowEmpty: true})
      .pipe(concat('head-content.html'))
      .pipe(dest('./output'));
}

function defaultTask(): NodeJS.ReadWriteStream {
  return src('example.yml').pipe(dest('./output/'));
}

export default parallel(defaultTask, concatHeaderFile);
