import { readFileSync } from 'node:fs';
import yaml from 'js-yaml';

export default (file, ex) => {
  const dataFromFile = readFileSync(file).toString();

  if (ex === 'json') {
    return JSON.parse(dataFromFile);
  }

  return yaml.load(dataFromFile);
};
