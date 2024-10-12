import _ from 'lodash';

const getIndent = (depth, spacesCount = 4) => depth * spacesCount - 2;

export default (file) => {
  const toPrint = (AST, depth) => {
    if (_.isPlainObject(AST)) {
      const result = Object.entries(AST)
        .map(([nodeName, nodeValue]) => ({ [nodeName]: nodeValue }));

      return toPrint(result, depth);
    }

    if (!_.isArray(AST)) {
      return AST;
    }

    const result = AST.reduce((acc, node) => {
      const [key] = Object.keys(node);
      const value = node[key];

      if (node.nodeType === 'added') {
        acc.push(`${' '.repeat(getIndent(depth))}+ ${key}: ${toPrint(value, depth + 1)}\n`);
        return acc;
      }

      if (node.nodeType === 'removed') {
        acc.push(`${' '.repeat(getIndent(depth))}- ${key}: ${toPrint(value, depth + 1)}\n`);
        return acc;
      }

      if (node.nodeType === 'updated') {
        acc.push(`${' '.repeat(getIndent(depth))}- ${key}: ${toPrint(value.valueDeleted, depth + 1)}\n`);
        acc.push(`${' '.repeat(getIndent(depth))}+ ${key}: ${toPrint(value.valueAdded, depth + 1)}\n`);
        return acc;
      }

      acc.push(`${' '.repeat(getIndent(depth))}  ${key}: ${toPrint(value, depth + 1)}\n`);
      return acc;
    }, ['{\n']);

    return [...result, `${' '.repeat(getIndent(depth) - 2)}}`].join('');
  };

  return toPrint(file, 1);
};
