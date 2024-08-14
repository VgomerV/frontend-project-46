import { readFileSync } from 'node:fs';

export default (file) => {
  const dataFromFile = readFileSync(file).toString();
  const parseFile = JSON.parse(dataFromFile);

  return parseFile;
};
