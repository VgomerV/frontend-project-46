#!/usr/bin/env node

import { Command } from 'commander';
import parsing from '../src/parsing.js';

const program = new Command();

program
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format <type>', 'output format')
  .action((filepath1, filepath2) => {
    parsing(filepath1, filepath2);
  });

program.parse();
