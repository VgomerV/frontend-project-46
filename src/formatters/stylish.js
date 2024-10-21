import _ from 'lodash';

const getIndent = (depth, spacesCount = 4) => ' '.repeat(depth * spacesCount - 2);

const renderValue = (val, depth) => {
  if (_.isPlainObject(val)) {
    const keys = Object.keys(val);
    const result = keys.reduce((acc, key) => [...acc, `${getIndent(depth)}  ${key}: ${renderValue(val[key], depth + 1)}\n`], ['{\n']);
    return [...result, `${' '.repeat((depth * 4) - 4)}}`].join('');
  }

  return val;
};

const toPrint = (tree, depth) => {
  const result = tree.reduce((acc, node) => {
    const [key] = Object.keys(node);
    const value = node[key];

    if (node.nodeType === 'added') {
      return [...acc, `${getIndent(depth)}+ ${key}: ${renderValue(value, depth + 1)}\n`];
    }

    if (node.nodeType === 'removed') {
      return [...acc, `${getIndent(depth)}- ${key}: ${renderValue(value, depth + 1)}\n`];
    }

    if (node.nodeType === 'updated') {
      return [
        ...acc,
        `${getIndent(depth)}- ${key}: ${renderValue(value.valueDeleted, depth + 1)}\n`,
        `${getIndent(depth)}+ ${key}: ${renderValue(value.valueAdded, depth + 1)}\n`,
      ];
    }

    if (node.nodeType === 'unchanged') {
      return [...acc, `${getIndent(depth)}  ${key}: ${renderValue(value, depth + 1)}\n`];
    }

    if (node.nodeType === 'nested') {
      return [...acc, `${getIndent(depth)}  ${key}: ${toPrint(value, depth + 1)}\n`];
    }

    return acc;
  }, ['{\n']);

  return [...result, `${' '.repeat((depth * 4) - 4)}}`].join('');
};

export default (data) => toPrint(data, 1);
