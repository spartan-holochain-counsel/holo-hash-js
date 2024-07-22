.PHONY:			FORCE
.PRECIOUS:		iterations/%.js


#
# Building
#
build:			lib/index.js
lib/index.js:		src/*.ts Makefile
	rm -f lib/*.js
	npx tsc -t es2022 -m es2022 --moduleResolution node --esModuleInterop	\
		--strictNullChecks 						\
		--outDir lib -d --sourceMap src/index.ts


#
# Project
#
package-lock.json:	package.json
	npm install
	touch $@
node_modules:		package-lock.json
	npm install
	touch $@
build:			node_modules


#
# Testing
#
DEBUG_LEVEL	       ?= warn
TEST_ENV_VARS		= LOG_LEVEL=$(DEBUG_LEVEL)
MOCHA_OPTS		= -n enable-source-maps

test:
	make -s test-unit

test-unit:		lib/index.js Makefile
	$(TEST_ENV_VARS) npx mocha $(MOCHA_OPTS) ./tests/unit

test-server:
	python3 -m http.server 8765


#
# Repository
#
clean-remove-chaff:
	@find . -name '*~' -exec rm {} \;
clean-files:		clean-remove-chaff
	git clean -nd
clean-files-force:	clean-remove-chaff
	git clean -fd
clean-files-all:	clean-remove-chaff
	git clean -ndx
clean-files-all-force:	clean-remove-chaff
	git clean -fdx


#
# NPM packaging
#
prepare-package:	lib/index.js
	rm -f dist/*
	npx webpack
	MODE=production npx webpack
	gzip -kf dist/*.js
preview-package:	clean-files test prepare-package
	npm pack --dry-run .
create-package:		clean-files test prepare-package
	npm pack .
publish-package:	clean-files test prepare-package
	npm publish --access public .
