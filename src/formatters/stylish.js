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

      const getValue = (flag) => {
        switch (flag) {
          case 'added':
            return !_.isArray(valueAfter) ? valueAfter : toPrint(valueAfter, depth + 1);
          case 'removed':
            return !_.isArray(valueBefore) ? valueBefore : toPrint(valueBefore, depth + 1);
          default:
            return !_.isArray(valueBefore) ? valueBefore : toPrint(valueBefore, depth + 1);
        }
      };

      if (status === 'unchanged') {
        acc.push(`${separator.repeat(depth * 4)}${node}: ${getValue(status)}\n`);
        return acc;
      }

      if (status === 'updated') {
        acc.push(`${separator.repeat(depth * 4 - 2)}${marker.removed} ${node}: ${getValue('removed')}\n`);
        acc.push(`${separator.repeat(depth * 4 - 2)}${marker.added} ${node}: ${getValue('added')}\n`);
        return acc;
      }

      acc.push(`${separator.repeat(depth * 4 - 2)}${marker[status]} ${node}: ${getValue(status)}\n`);

      return acc;
    }, ['{\n']);

    result.push(`${separator.repeat(depth * 4 - 4)}}`);

    return result.join('');
  };

  return toPrint(file, 1);
};
