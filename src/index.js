import _ from 'lodash';
import parsing from './parsing.js';

export default (path1, path2) => {
  const extension = path1.split('.')[0];

  const dataFromFile1 = parsing(path1, extension);
  const dataFromFile2 = parsing(path2, extension);

  const keys1 = Object.keys(dataFromFile1);
  const keys2 = Object.keys(dataFromFile2);

  const unionArray = _.union(keys1, keys2)
    .sort((a, b) => a.localeCompare(b));

  const result = unionArray.reduce((acc, key) => {
    if (!Object.hasOwn(dataFromFile1, key)) {
      acc.push(`  + ${key}: ${dataFromFile2[key]}\n`);
    } else if (!Object.hasOwn(dataFromFile2, key)) {
      acc.push(`  - ${key}: ${dataFromFile1[key]}\n`);
    } else if (dataFromFile1[key] === dataFromFile2[key]) {
      acc.push(`    ${key}: ${dataFromFile1[key]}\n`);
    } else {
      acc.push(`  - ${key}: ${dataFromFile1[key]}\n`);
      acc.push(`  + ${key}: ${dataFromFile2[key]}\n`);
    }

    return acc;
  }, ['{\n']);

  result.push('}');
  return result.join('');
};
