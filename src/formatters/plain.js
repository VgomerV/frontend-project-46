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
        return [...acc, `Property '${path}${key}' was added with value: ${getFormatValue(node[key])}`];
      case 'removed':
        return [...acc, `Property '${path}${key}' was removed`];
      case 'updated':
        return [...acc, `Property '${path}${key}' was updated. From ${getFormatValue(node[key].valueDeleted)} to ${getFormatValue(node[key].valueAdded)}`];
      case 'unchanged':
        return acc;
      case 'nested':
        return [...acc, plain(node[key], `${path + key}.`)];
      default:
        return acc;
    }
  }, []);
  return result.join('\n');
};

export default plain;
