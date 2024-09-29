import _ from 'lodash';

export default (file) => {
  const marker = {
    unchanged: ' ',
    added: '+',
    removed: '-',
  };

  const separator = ' ';

  const toPrint = (data, depth) => {
    const result = data.reduce((acc, AST) => {
      const {
        node,
        valueBefore,
        valueAfter,
        status,
      } = AST;

      if (status === 'unchanged') {
        acc.push(`${separator.repeat(depth * 4)}${node}: ${!_.isArray(valueBefore) ? valueBefore : toPrint(valueBefore, depth + 1)}\n`);
        return acc;
      }

      if (status === 'added') {
        acc.push(`${separator.repeat(depth * 4 - 2)}${marker[status]} ${node}: ${!_.isArray(valueAfter) ? valueAfter : toPrint(valueAfter, depth + 1)}\n`);
        return acc;
      }

      if (status === 'removed') {
        acc.push(`${separator.repeat(depth * 4 - 2)}${marker[status]} ${node}: ${!_.isArray(valueBefore) ? valueBefore : toPrint(valueBefore, depth + 1)}\n`);
        return acc;
      }

      if (status === 'updated') {
        acc.push(`${separator.repeat(depth * 4 - 2)}${marker.removed} ${node}: ${!_.isArray(valueBefore) ? valueBefore : toPrint(valueBefore, depth + 1)}\n`);
        acc.push(`${separator.repeat(depth * 4 - 2)}${marker.added} ${node}: ${!_.isArray(valueAfter) ? valueAfter : toPrint(valueAfter, depth + 1)}\n`);

        return acc;
      }

      return acc;
    }, ['{\n']);

    result.push(`${separator.repeat(depth * 4 - 4)}}`);

    return result.join('');
  };

  return toPrint(file, 1);
};
