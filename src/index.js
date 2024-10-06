import _ from 'lodash';
import { readFileSync } from 'node:fs';
import path from 'path';
import parsing from './parsers.js';
import formatter from './formatters/index.js';

const iter = (value) => {
  if (!_.isPlainObject(value)) {
    return value;
  }
  const entries = Object.entries(value);
  const result = entries.map((item) => {
    const [nodeName, val] = item;
    return { [nodeName]: iter(val), nodeType: 'unchanged' };
  });

  return result;
};

const getAST = (data1, data2) => {
  const keysFromFile1 = Object.keys(data1);
  const keysFromFile2 = Object.keys(data2);

  const keys = _.sortBy(_.union(keysFromFile1, keysFromFile2));

  return keys.reduce((acc, key) => {
    const value1 = data1[key];
    const value2 = data2[key];

    if (!Object.hasOwn(data1, key)) {
      acc.push({ [key]: iter(value2), nodeType: 'added' });
      return acc;
    }

    if (!Object.hasOwn(data2, key)) {
      acc.push({ [key]: iter(value1), nodeType: 'removed' });
      return acc;
    }

    if (_.isEqual(value1, value2)) {
      acc.push({ [key]: value1, nodeType: 'unchanged' });
      return acc;
    }

    if (_.isPlainObject(value1) && _.isPlainObject(value2)) {
      acc.push({ [key]: getAST(value1, value2), nodeType: 'unchanged' });
      return acc;
    }

    acc.push({
      [key]: { valueDeleted: iter(value1), valueAdded: iter(value2) }, nodeType: 'updated',
    });

    return acc;
  }, []);
};

const genDiff = (file1, file2, format) => {
  const extensionFile1 = file1.split('.')[1];
  const extensionFile2 = file1.split('.')[1];

  const dataFromFile1 = readFileSync(path.resolve('__fixtures__/', file1), 'utf-8');
  const dataFromFile2 = readFileSync(path.resolve('__fixtures__/', file2), 'utf-8');

  const parsedData1 = parsing(dataFromFile1, extensionFile1);
  const parsedData2 = parsing(dataFromFile2, extensionFile2);

  return formatter(getAST(parsedData1, parsedData2), format);
};

export default genDiff;
