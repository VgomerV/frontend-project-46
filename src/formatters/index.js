import stylish from './stylish.js';
import plain from './plain.js';

const formatters = {
  stylish,
  plain,
  json: JSON.stringify,
};

export default (data, format) => formatters[format](data);
