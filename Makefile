# Makefile

install:
	npm ci

publish:
	npm publish --dry-run

lint:
	npx eslint .

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8

run:
	gendiff -f stylish __fixtures__/file1.json __fixtures__/file2.json