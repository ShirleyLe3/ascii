PATH := node_modules/.bin:$(PATH)

all: lint test clean build

lint: node_modules
	eslint --ext .ts src

test: node_modules
	# jest

clean:
	rm -rf dist

patch: node_modules
	ts-patch i -s

build: patch
	tsc -m esnext --outDir dist/esm
	rollup -c

watch: patch
	tmux \
		new tsc -w -m esnext --outDir dist/esm \; \
		splitw -dbl 6 rollup -wc \; \
		set-option destroy-unattached on

release: all
	git add dist
	standard-version -a

node_modules: package.json
	npm i && touch $@

.PHONY: all lint test clean patch build watch release
