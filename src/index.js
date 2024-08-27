import _ from 'lodash';
import parsing from './parsing.js';
import formatter from './formatters.js';

const parsingObject = (obj, flag) => Object.keys(obj)
  .map((key) => {
    const value = obj[key];

    return [key, !_.isObject(value) ? value : parsingObject(value, flag), flag];
});

const genDiff = (file1, file2, format) => {
  const extension = file1.split('.')[1];

  const dataFromFile1 = parsing(file1, extension);
  const dataFromFile2 = parsing(file2, extension);

  const iter = (file1, file2) => {
    const keysFromFile1 = Object.keys(file1);
    const keysFromFile2 = Object.keys(file2);

    const keys = _.union(keysFromFile1, keysFromFile2)
      .sort((a, b) => a.localeCompare(b));

    const dataForFormatter = keys.reduce((acc, key) => {
      const hasFile1Key = Object.hasOwn(file1, key);
      const hasFile2Key = Object.hasOwn(file2, key);

      const value1 = file1[key];
      const value2 = file2[key];

      const value1IsObject = _.isObject(value1);
      const value2IsObject = _.isObject(value2);

      if (!hasFile1Key) {
        acc.push([key, !value2IsObject ? value2 : parsingObject(value2, ' '), '+']);
        return acc;
      }

      if (!hasFile2Key) {
        acc.push([key, !value1IsObject ? value1 : parsingObject(value1, ' '), '-']);
        return acc;
      }

      if (_.isEqual(value1, value2)) {
        acc.push([key, !value1IsObject ? value1 : parsingObject(value1, ' '), ' ']);
        return acc;
      }

      if (!value1IsObject && !value2IsObject) {
        acc.push([key, value1, '-']);
        acc.push([key, value2, '+']);
        return acc;
      }

      if (!value1IsObject && value2IsObject) {
        acc.push([key, value1, '-']);
        acc.push([key, parsingObject(value1, ' '), '+']);
        return acc;
      }

      if (value1IsObject && !value2IsObject) {
        acc.push([key, parsingObject(value1, ' '), '-']);
        acc.push([key, value2, '+']);
        return acc;
      }

      if (value1IsObject && value2IsObject) {
        acc.push([key, iter(value1, value2), ' ']);
        return acc;
      }

      return acc;
    }, []);

    return dataForFormatter;
  };

  return formatter(iter(dataFromFile1, dataFromFile2), format);
};

export default genDiff;
