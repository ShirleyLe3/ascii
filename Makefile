PATH := node_modules/.bin:$(PATH)

lint := eslint --ext .ts src
build := tsc -m esnext --outDir dist/esm
bundle := rollup -c
clean := rm -rf dist

all: lint test clean build bundle

lint: node_modules
	$(lint)

fix: node_modules
	$(lint) --fix

test: node_modules
	# jest

clean:
	$(clean)

build: node_modules
	$(build)

bundle: node_modules
	$(bundle)

watch: node_modules
	tmux new $(build) -w \; \
		splitw -dbl 6 $(bundle) -w \; \
		set-option destroy-unattached on

release: all
	git add dist
	standard-version -a

node_modules: package.json
	npm i && touch $@
	ts-patch i -s
