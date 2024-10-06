import yaml from 'js-yaml';

export default (file, extension) => (extension === 'json' ? JSON.parse(file) : yaml.load(file));
