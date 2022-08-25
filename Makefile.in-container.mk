export PROJECT_NAME ?= cube_frontend

.PHONY: dependencies
dependencies:
	npm i

.PHONY: run
run:
	npm run start:mock
	# npm run start
