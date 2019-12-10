PATH := node_modules/.bin:$(PATH)

all: lint test clean build

lint: node_modules
	tslint -p .

test: node_modules
	# jest

clean:
	rm -rf dist

build: node_modules
	ttsc -d -m esnext --outDir dist/esm
	rollup -c

release: all
	git add dist
	standard-version -a

node_modules: package.json
	npm i && touch $@

.PHONY: all lint test clean build release
