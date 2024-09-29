import _ from 'lodash';

const getPath = (AST) => {
  const getFormatValue = (value) => {
    if (_.isObject(value)) {
      return '[complex value]';
    }

    return typeof value === 'string' ? `'${value}'` : value;
  };

  const { status } = AST;
  const message = [];

  if (status === 'added') {
    message.push(`was added with value: ${getFormatValue(AST.valueAfter)}`);
    return [message];
  }

  if (status === 'removed') {
    message.push('was removed');
    return [message];
  }

  if (status === 'updated') {
    message.push(`was updated. From ${getFormatValue(AST.valueBefore)} to ${getFormatValue(AST.valueAfter)}`);
    return [message];
  }
  return [message];
};

export default (file) => {
  const toPrint = (data, arr) => {
    const result = data.reduce((acc, item) => {
      arr.push(item.node);
      if (_.isArray(item.valueBefore) && item.status === 'unchanged') {
        acc.push(toPrint(item.valueBefore, arr));
        arr.pop();
        return acc;
      }

      const [messages] = getPath(item);

      const getFullMessage = messages.map((messge) => `Property '${arr.flat().join('.')}' ${messge}`);

      arr.pop();
      return [...acc, ...getFullMessage];
    }, []);

    return result.join('\n');
  };

  return toPrint(file, []);
};
