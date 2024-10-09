import _ from 'lodash';

const getSpaceCount = (type, count) => {
  const spaceValues = {
    unchanged: count * 4,
    nested: count * 4,
    undefined: count * 4,
    other: count * 4 - 2,
  };

  return Object.hasOwn(spaceValues, type) ? spaceValues[type] : spaceValues.other;
};

export default (file) => {
  const marker = {
    added: '+',
    removed: '-',
  };

  const separator = ' ';

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

      const spaceCount = getSpaceCount(node.nodeType, depth);

      if (node.nodeType === 'updated') {
        acc.push(`${separator.repeat(spaceCount)}${marker.removed} ${key}: ${toPrint(node[key].valueDeleted, depth + 1)}\n`);
        acc.push(`${separator.repeat(spaceCount)}${marker.added} ${key}: ${toPrint(node[key].valueAdded, depth + 1)}\n`);
        return acc;
      }

      const hasMarker = Object.hasOwn(marker, node.nodeType);

      acc.push(`${separator.repeat(spaceCount)}${hasMarker ? `${marker[node.nodeType]} ` : ''}${key}: ${toPrint(value, depth + 1)}\n`);
      return acc;
    }, ['{\n']);

    return [...result, `${separator.repeat(depth * 4 - 4)}}`].join('');
  };

  return toPrint(file, 1);
};
