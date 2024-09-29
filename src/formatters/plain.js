import _ from 'lodash';

const getPath = (AST) => {
  let valueBefore = '';
  let valueAfter = '';

  if (_.isObject(AST.valueBefore)) {
    valueBefore = '[complex value]';
  } else if (typeof AST.valueBefore === 'string') {
    valueBefore = `'${AST.valueBefore}'`;
  } else {
    valueBefore = AST.valueBefore;
  }

  if (_.isObject(AST.valueAfter)) {
    valueAfter = '[complex value]';
  } else if (typeof AST.valueAfter === 'string') {
    valueAfter = `'${AST.valueAfter}'`;
  } else {
    valueAfter = AST.valueAfter;
  }

  const { status } = AST;
  const message = [];

  if (status === 'added') {
    message.push(`was added with value: ${valueAfter}`);
    return [message];
  }

  if (status === 'removed') {
    message.push('was removed');
    return [message];
  }

  if (status === 'updated') {
    message.push(`was updated. From ${valueBefore} to ${valueAfter}`);
    return [message];
  }
  return [message];
};

export default (file) => {
  const toPrint2 = (data, arr) => {
    const result = data.reduce((acc, item) => {
      arr.push(item.node);
      if (_.isArray(item.valueBefore) && item.status === 'unchanged') {
        acc.push(toPrint2(item.valueBefore, arr));
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

  return toPrint2(file, []);
};
