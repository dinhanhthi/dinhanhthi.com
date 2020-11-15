coverage:
			rm -rf coverage
			istanbul cover node_modules/.bin/_mocha

lint:
			./node_modules/.bin/eslint --reset .

test: lint
			mocha

test-ci: lint
			istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly -- -R spec && cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js && rm -rf ./coverage

.PHONY: lint coverage
.SILENT: lint
