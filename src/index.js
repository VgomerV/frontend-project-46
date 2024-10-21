import _ from 'lodash';
import { readFileSync } from 'fs';
import path from 'path';
import parsing from './parsers.js';
import formatter from './formatters/index.js';

const getData = (pathToFile) => {
  const absolutePath = path.resolve(process.cwd(), pathToFile);

  return readFileSync(absolutePath, 'utf-8');
};

const getTree = (data1, data2) => _.sortBy(_.union(Object.keys(data1), Object.keys(data2)))
  .reduce((acc, key) => {
    const value1 = data1[key];
    const value2 = data2[key];

    if (!Object.hasOwn(data1, key)) {
      return [...acc, { [key]: value2, nodeType: 'added' }];
    }

    if (!Object.hasOwn(data2, key)) {
      return [...acc, { [key]: value1, nodeType: 'removed' }];
    }

    if (_.isPlainObject(value1) && _.isPlainObject(value2)) {
      return [...acc, { [key]: getTree(value1, value2), nodeType: 'nested' }];
    }

    if (!_.isEqual(value1, value2)) {
      return [...acc, { [key]: { valueDeleted: value1, valueAdded: value2 }, nodeType: 'updated' }];
    }
    return [...acc, { [key]: value1, nodeType: 'unchanged' }];
  }, []);

const genDiff = (filepath1, filepath2, format = 'stylish') => {
  const extensionFile1 = filepath1.split('.')[1];
  const extensionFile2 = filepath2.split('.')[1];

  const parsedData1 = parsing(getData(filepath1), extensionFile1);
  const parsedData2 = parsing(getData(filepath2), extensionFile2);

  return formatter(getTree(parsedData1, parsedData2), format);
};

export default genDiff;
