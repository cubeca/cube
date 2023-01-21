export PROJECT_NAME ?= cube_frontend

.PHONY: dependencies
dependencies:
	npm i

.PHONY: build
build:
	npm run build

.PHONY: serve
serve:
	serve -s build

.PHONY: run
run:
	# npm run start:mock
	npm run start
