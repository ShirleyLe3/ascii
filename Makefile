PATH := node_modules/.bin:$(PATH)

all: lint test clean build

lint: node_modules
	tslint -p .

test: node_modules
	# jest

clean:
	rm -rf dist

build: node_modules
	ttsc -m esnext --outDir dist/esm
	rollup -c

watch: node_modules
	tmux a -t watch || tmux new -s watch \
		ttsc -w -m esnext --outDir dist/esm \; \
		splitw -dbl 6 rollup -wc

release: all
	git add dist
	standard-version -a

node_modules: package.json
	npm i && touch $@

.PHONY: all lint test clean build watch release
