PATH := node_modules/.bin:$(PATH)

all: lint test clean build

lint: node_modules
	eslint --ext .ts src

test: node_modules
	# jest

clean:
	rm -rf dist

build: node_modules
	tsc -m esnext --outDir dist/esm
	rollup -c

watch: node_modules
	tmux \
		new tsc -w -m esnext --outDir dist/esm \; \
		splitw -dbl 6 rollup -wc \; \
		set-option destroy-unattached on

release: all
	git add dist
	standard-version -a

node_modules: package.json
	npm i && touch $@
	ts-patch i -s

.PHONY: all lint test clean build watch release
