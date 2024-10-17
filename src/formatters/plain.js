import _ from 'lodash';

const getFormatValue = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }
  return typeof value === 'string' ? `'${value}'` : value;
};

const plain = (tree, path = '') => {
  const result = tree.reduce((acc, node) => {
    const [key] = Object.keys(node);
    switch (node.nodeType) {
      case 'added':
        acc.push(`Property '${path}${key}' was added with value: ${getFormatValue(node[key])}`);
        return acc;
      case 'removed':
        acc.push(`Property '${path}${key}' was removed`);
        return acc;
      case 'updated':
        acc.push(`Property '${path}${key}' was updated. From ${getFormatValue(node[key].valueDeleted)} to ${getFormatValue(node[key].valueAdded)}`);
        return acc;
      case 'unchanged':
        return acc;
      case 'nested':
        acc.push(plain(node[key], `${path + key}.`));
        return acc;
      default:
        return acc;
    }
  }, []);
  return result.join('\n');
};

export default plain;
