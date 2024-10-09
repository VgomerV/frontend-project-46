import _ from 'lodash';
import { readFileSync } from 'fs';
import parsing from './parsers.js';
import formatter from './formatters/index.js';

const getAST = (data1, data2) => _.sortBy(_.union(Object.keys(data1), Object.keys(data2)))
  .reduce((acc, key) => {
    const value1 = data1[key];
    const value2 = data2[key];

    if (!Object.hasOwn(data1, key)) {
      acc.push({ [key]: value2, nodeType: 'added' });
      return acc;
    }

    if (!Object.hasOwn(data2, key)) {
      acc.push({ [key]: value1, nodeType: 'removed' });
      return acc;
    }

    if (_.isPlainObject(value1) && _.isPlainObject(value2)) {
      acc.push({ [key]: getAST(value1, value2), nodeType: 'nested' });
      return acc;
    }

    if (!_.isEqual(value1, value2)) {
      acc.push({
        [key]: { valueDeleted: value1, valueAdded: value2 }, nodeType: 'updated',
      });
    } else {
      acc.push({ [key]: value1, nodeType: 'unchanged' });
    }

    return acc;
  }, []);

const genDiff = (file1, file2, format) => {
  const getData = (file) => readFileSync(file, 'utf-8');

  const extensionFile1 = file1.split('.')[1];
  const extensionFile2 = file1.split('.')[1];

  const parsedData1 = parsing(getData(file1), extensionFile1);
  const parsedData2 = parsing(getData(file2), extensionFile2);

  return formatter(getAST(parsedData1, parsedData2), format);
};

export default genDiff;
