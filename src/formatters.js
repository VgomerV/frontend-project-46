import _ from 'lodash';

const stylish = (data) => {
    const toPrint = (arr, depth) => {
      const space = ' ';
      const result = arr.reduce((acc, item) => {
        const [key, value, flag] = item;
  
        flag === space ? acc.push(`${space.repeat(depth * 4)}${key}: ${!_.isArray(value) ? value : toPrint(value, depth + 1)}\n`) : acc.push(`${space.repeat(depth * 4 - 2)}${flag} ${key}: ${!_.isArray(value) ? value : toPrint(value, depth + 1)}\n`);
        return acc;
      }, ['{\n']);
  
      result.push(`${space.repeat(depth * 4 - 4)}}`);
      return result.join('');
    }
  
    return toPrint(data, 1);
};

export default (data, format) => {
  switch (format) {
    case 'plain':
      return plain(tree);
    case 'json':
      return JSON.stringify(data);
    default:
      return stylish(data);
  }
};