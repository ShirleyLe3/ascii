PATH := node_modules/.bin:$(PATH)

all: lint test clean build

lint: node_modules
	tslint -p .

test: node_modules
	#jest

clean:
	rm -rf dist

build: node_modules
	tsc -d -m esnext --outDir dist/esm
	tsc -d -m commonjs --outDir dist/cjs
	rollup -c

release: all
	git add -A
	standard-version -a

node_modules:
	yarn

.PHONY: all lint test clean build release
