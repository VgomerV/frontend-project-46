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

  const resultAST = keys.reduce((acc, key) => {
    const data1IsObject = Object.hasOwn(data1, key);
    const data2IsObject = Object.hasOwn(data2, key);

    const value1 = data1[key];
    const value2 = data2[key];

    const value1IsObject = _.isObject(value1);
    const value2IsObject = _.isObject(value2);

    if (!data1IsObject) {
      acc.push({
        node: key,
        valueAfter: iter(value2),
        status: 'added',
      });

      return acc;
    }

    if (!data2IsObject) {
      acc.push({
        node: key,
        valueBefore: iter(value1),
        status: 'removed',
      });

      return acc;
    }

    if (_.isEqual(value1, value2)) {
      acc.push({
        node: key,
        valueBefore: iter(value1),
        status: 'unchanged',
      });

      return acc;
    }

    if ((!value1IsObject || !value2IsObject) && !_.isEqual(value1, value2)) {
      acc.push({
        node: key,
        valueBefore: iter(value1),
        valueAfter: iter(value2),
        status: 'updated',
      });

      return acc;
    }

    if ((value1IsObject && value2IsObject) && !_.isEqual(value1, value2)) {
      acc.push({
        node: key,
        valueBefore: getAST(value1, value2),
        status: 'unchanged',
      });

      return acc;
    }

    return acc;
  }, []);

  return resultAST;
};

const genDiff = (file1, file2, format) => {
  const extension = file1.split('.')[1];

  const dataFromFile1 = parsing(file1, extension);
  const dataFromFile2 = parsing(file2, extension);

  return formatter(getAST(dataFromFile1, dataFromFile2), format);
};

export default genDiff;
