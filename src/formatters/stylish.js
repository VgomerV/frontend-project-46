import _ from 'lodash';

const getRepeatIn = (type, count) => (type === 'unchanged' ? (count * 4) : (count * 4 - 2));

export default (file) => {
  const marker = {
    added: '+',
    removed: '-',
  };

  const separator = ' ';

  const toPrint = (AST, depth) => {
    if (!_.isArray(AST)) {
      return AST;
    }

    const result = AST.reduce((acc, node) => {
      const entries = Object.keys(node);
      const [key] = entries;

      const spaceCount = getRepeatIn(node.nodeType, depth);

      if (node.nodeType === 'unchanged') {
        acc.push(`${separator.repeat(spaceCount)}${key}: ${toPrint(node[key], depth + 1)}\n`);
        return acc;
      }

      if (node.nodeType === 'updated') {
        acc.push(`${separator.repeat(spaceCount)}${marker.removed} ${key}: ${toPrint(node[key].valueDeleted, depth + 1)}\n`);
        acc.push(`${separator.repeat(spaceCount)}${marker.added} ${key}: ${toPrint(node[key].valueAdded, depth + 1)}\n`);
        return acc;
      }

      acc.push(`${separator.repeat(spaceCount)}${marker[node.nodeType]} ${key}: ${toPrint(node[key], depth + 1)}\n`);

      return acc;
    }, ['{\n']);

    result.push(`${separator.repeat(depth * 4 - 4)}}`);

    return result.join('');
  };

  return toPrint(file, 1);
};
