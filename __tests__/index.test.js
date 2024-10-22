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

const getPath = (formatterName) => path.resolve('__fixtures__/', `result-${formatterName}.txt`);

test.each(param)('testing genDiff', (extension, formatter) => {
  const expected = readFileSync(getPath(formatter), 'utf-8');
  const received = genDiff(`__fixtures__/file1.${extension}`, `__fixtures__/file2.${extension}`, `${formatter}`);

  expect(received).toEqual(expected);
});
