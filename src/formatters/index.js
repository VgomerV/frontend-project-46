import stylish from './stylish.js';
import plain from './plain.js';

export default (data, format) => {
  switch (format) {
    case 'json':
      return JSON.stringify(data, null, 2);
    case 'plain':
      return plain(data);
    default:
      return stylish(data);
  }
};
