import { readFileSync } from 'node:fs';
import path from 'path';
import yaml from 'js-yaml';

export default (file, extension) => {
  const dataFromFile = readFileSync(path.resolve('__fixtures__/', file), 'utf-8').toString();

  switch (extension) {
    case 'json':
      return JSON.parse(dataFromFile);
    case 'yaml':
      return yaml.load(dataFromFile);
    case 'yml':
      return yaml.load(dataFromFile);
    default:
      throw new Error(`Ошибка чтения ${file}. Проверьте расширение имени файла. Допустимые форматы 'json', 'yaml'`);
  }
};
