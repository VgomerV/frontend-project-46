import path from 'path';
import { readFileSync } from 'node:fs';
import genDiff from '../src/index.js';

const param = [
  ['json', 'stylish'],
  ['yaml', 'stylish'],
  ['json', 'plain'],
  ['yaml', 'plain'],
  ['json', 'json'],
  ['yaml', 'json'],
];

test.each(param)('test genDiff, format - %s, formatter - %s', (format, formatter) => {
  expect(genDiff(`file1.${format}`, `file2.${format}`, `${formatter}`)).toEqual(readFileSync(path.resolve('__fixtures__/', `result-${formatter}.txt`), 'utf-8'));
});
