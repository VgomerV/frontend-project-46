import _ from 'lodash';
import parsing from './parsers.js';
import formatter from './formatters/index.js';

const iter = (value) => {
  if (!_.isObject(value)) {
    return value;
  }
  const entries = Object.entries(value);
  const result = entries.map((item) => {
    const [nodeName, val] = item;
    return { node: nodeName, valueBefore: iter(val), status: 'unchanged' };
  });

  return result;
};

const getAST = (data1, data2) => {
  const keysFromFile1 = Object.keys(data1);
  const keysFromFile2 = Object.keys(data2);

  const keys = _.union(keysFromFile1, keysFromFile2)
    .sort((keys1, keys2) => keys1.localeCompare(keys2));

  return keys.reduce((acc, key) => {
    const value1 = data1[key];
    const value2 = data2[key];

    if (!Object.hasOwn(data1, key)) {
      acc.push({ node: key, valueAfter: iter(value2), status: 'added' });
      return acc;
    }

    if (!Object.hasOwn(data2, key)) {
      acc.push({ node: key, valueBefore: iter(value1), status: 'removed' });
      return acc;
    }

    if (_.isEqual(value1, value2)) {
      acc.push({ node: key, valueBefore: iter(value1), status: 'unchanged' });
      return acc;
    }

    if ((!_.isObject(value1) || !_.isObject(value2)) && !_.isEqual(value1, value2)) {
      acc.push({
        node: key, valueBefore: iter(value1), valueAfter: iter(value2), status: 'updated',
      });
      return acc;
    }

    acc.push({ node: key, valueBefore: getAST(value1, value2), status: 'unchanged' });

    return acc;
  }, []);
};

const genDiff = (file1, file2, format) => {
  const extension = file1.split('.')[1];

  const dataFromFile1 = parsing(file1, extension);
  const dataFromFile2 = parsing(file2, extension);

  return formatter(getAST(dataFromFile1, dataFromFile2), format);
};

export default genDiff;
