import _ from 'lodash';

const getSpaceCount = (type, count) => {
  const count1 = count * 4;
  const count2 = count * 4 - 2;

  const spaceValues = {
    unchanged: count1,
    nested: count1,
    undefined: count1,
    other: count2,
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
      const keys = Object.keys(node);
      const [key] = keys;
      const value = node[key];

      const spaceCount = getSpaceCount(node.nodeType, depth);

      if (node.nodeType === 'updated') {
        const valueBefore = node[key].valueDeleted;
        const valueAfter = node[key].valueAdded;

        acc.push(`${separator.repeat(spaceCount)}${marker.removed} ${key}: ${toPrint(valueBefore, depth + 1)}\n`);
        acc.push(`${separator.repeat(spaceCount)}${marker.added} ${key}: ${toPrint(valueAfter, depth + 1)}\n`);
        return acc;
      }

      if (Object.hasOwn(marker, node.nodeType)) {
        acc.push(`${separator.repeat(spaceCount)}${marker[node.nodeType]} ${key}: ${toPrint(value, depth + 1)}\n`);
        return acc;
      }

      acc.push(`${separator.repeat(spaceCount)}${key}: ${toPrint(value, depth + 1)}\n`);
      return acc;
    }, ['{\n']);

    result.push(`${separator.repeat(depth * 4 - 4)}}`);

    return result.join('');
  };

  return toPrint(file, 1);
};
