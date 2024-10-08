import _ from 'lodash';

const getPath = (obj) => {
  const getFormatValue = (value) => {
    if (_.isObject(value)) {
      return '[complex value]';
    }
    return typeof value === 'string' ? `'${value}'` : value;
  };

  const entries = Object.keys(obj);
  const [key] = entries;

  const message = [];

  switch (obj.nodeType) {
    case 'added':
      message.push(`was added with value: ${getFormatValue(obj[key])}`);
      break;
    case 'removed':
      message.push('was removed');
      break;
    case 'updated':
      message.push(`was updated. From ${getFormatValue(obj[key].valueDeleted)} to ${getFormatValue(obj[key].valueAdded)}`);
      break;
    default:
      break;
  }

  return [message];
};

export default (file) => {
  const toPrint = (AST, arr) => {
    const result = AST.reduce((acc, node) => {
      const entries = Object.keys(node);
      const [key] = entries;

      arr.push(key);

      if (_.isArray(node[key]) && node.nodeType === 'nested') {
        acc.push(toPrint(node[key], arr));
        arr.pop();
        return acc;
      }

      const [messages] = getPath(node);

      const getFullMessage = messages.map((messge) => `Property '${arr.flat().join('.')}' ${messge}`);

      arr.pop();
      return [...acc, ...getFullMessage];
    }, []);

    return result.join('\n');
  };

  return toPrint(file, []);
};
