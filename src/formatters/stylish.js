import _ from 'lodash';

const getIndent = (depth, spacesCount = 4) => ' '.repeat(depth * spacesCount - 2);

const toPrint = (tree, depth) => {
  if (_.isPlainObject(tree)) {
    const result = Object.entries(tree)
      .map(([nodeName, nodeValue]) => ({ [nodeName]: nodeValue }));

    return toPrint(result, depth);
  }

  if (!_.isArray(tree)) {
    return tree;
  }

  const result = tree.reduce((acc, node) => {
    const [key] = Object.keys(node);
    const value = node[key];

    if (node.nodeType === 'added') {
      acc.push(`${getIndent(depth)}+ ${key}: ${toPrint(value, depth + 1)}\n`);
      return acc;
    }

    if (node.nodeType === 'removed') {
      acc.push(`${getIndent(depth)}- ${key}: ${toPrint(value, depth + 1)}\n`);
      return acc;
    }

    if (node.nodeType === 'updated') {
      acc.push(`${getIndent(depth)}- ${key}: ${toPrint(value.valueDeleted, depth + 1)}\n`);
      acc.push(`${getIndent(depth)}+ ${key}: ${toPrint(value.valueAdded, depth + 1)}\n`);
      return acc;
    }

    acc.push(`${getIndent(depth)}  ${key}: ${toPrint(value, depth + 1)}\n`);
    return acc;
  }, ['{\n']);

  return [...result, `${' '.repeat((depth * 4) - 4)}}`].join('');
};

export default (data) => toPrint(data, 1);
