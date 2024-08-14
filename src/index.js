import _ from 'lodash';
import parsing from './parsing.js';

export default (path1, path2) => {
  const dataFromFile1 = parsing(path1);
  const dataFromFile2 = parsing(path2);

  const keys1 = Object.keys(dataFromFile1);
  const keys2 = Object.keys(dataFromFile2);

  const unionArray = _.union(keys1, keys2)
    .sort((a, b) => a.localeCompare(b));

  let result = '{\n';

  for (const key of unionArray) {
    if (!Object.hasOwn(dataFromFile1, key)) {
      result = `${result}  + ${key}: ${dataFromFile2[key]}\n`;
      continue;
    }

    if (!Object.hasOwn(dataFromFile2, key)) {
      result = `${result}  - ${key}: ${dataFromFile1[key]}\n`;
    } else if (dataFromFile1[key] === dataFromFile2[key]) {
      result = `${result}    ${key}: ${dataFromFile1[key]}\n`;
    } else {
      result = `${result}  - ${key}: ${dataFromFile1[key]}\n  + ${key}: ${dataFromFile2[key]}\n`;
    }
  }

  result = `${result}}`;
  return result;
};
