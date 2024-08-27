# Makefile

install:
	npm ci

lint:
	npx eslint .

test:
	NODE_OPTIONS=--experimental-vm-modules npx jest

startJ:
	node bin/gendiff __fixtures__/file1.json __fixtures__/file2.json

startY:
	node bin/gendiff __fixtures__/file1.yaml __fixtures__/file2.yaml