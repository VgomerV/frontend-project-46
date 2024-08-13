import { readFileSync } from 'node:fs';

export default (path1, path2) => {
    const dataFromFile1 = readFileSync(path1).toString();
    const dataFromFile2 = readFileSync(path2).toString();

    const parseFile1 = JSON.parse(dataFromFile1);
    const parseFile2 = JSON.parse(dataFromFile2);

    return [parseFile1, parseFile2];
};