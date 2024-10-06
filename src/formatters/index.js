import stylish from './stylish.js';
import plain from './plain.js';

const formatters = {
  stylish,
  plain,
};

export default (data, format = 'stylish') => (format === 'json' ? JSON.stringify(data, null, 2) : formatters[format](data));
