# https://lithic.tech/blog/2020-05/makefile-dot-env
include .env.example
export
DOCKER_ENV_FILE_PARAM = --env-file .env.example
ENV_FILE = .env.example
ifneq (,$(wildcard ./.env))
	include .env
	export
	DOCKER_ENV_FILE_PARAM = --env-file .env.example --env-file .env
	ENV_FILE = .env
endif

DOCKER ?= docker

LOCAL_DOCKER_IMAGE ?= cubeca/frontend:latest

NPMRC_FILEPATH ?= $(HOME)/.npmrc

.PHONY: check_user_npmrc
check_npmrc:
	echo "TODO check that $NPMRC_FILEPATH exists"

.PHONY: docker_build
docker_build: check_user_npmrc
	$(DOCKER) buildx build \
	--file ./Dockerfile \
	--build-arg GENERATE_SOURCEMAP=$(GENERATE_SOURCEMAP) \
	--tag $(LOCAL_DOCKER_IMAGE) \
	--output=type=docker \
	--secret id=npmrc,src=$(NPMRC_FILEPATH) \
	.

# This defaults to running in the foreground to see any log messages right away.
# To run this in the background, replace `--tty` AND `--interactive` with `--detach`.
# GENERATE_SOURCEMAP is only here to satisfy `runtime-env-cra`'s requirement for all env vars mentioned in .env.example to be present
.PHONY: docker_run
docker_run:
	$(DOCKER) run \
	--rm \
	--tty \
	--interactive \
	--publish 127.0.0.1:$(PORT):$(PORT)/tcp \
	--env NODE_ENV=$(NODE_ENV) \
	--env PORT=$(PORT) \
	--env GENERATE_SOURCEMAP=$(GENERATE_SOURCEMAP) \
	--env REACT_APP_API_URL=$(REACT_APP_API_URL) \
	--env REACT_APP_AUTH_SERVICE_URL=$(REACT_APP_AUTH_SERVICE_URL) \
	$(LOCAL_DOCKER_IMAGE)


.PHONY: docker_build_local_dev
docker_build_local_dev: check_user_npmrc
	$(DOCKER) buildx build \
	--file ./local-dev.dockerfile \
	--tag $(LOCAL_DOCKER_IMAGE) \
	--output=type=docker \
	--secret id=npmrc,src=$(NPMRC_FILEPATH) \
	.

# This defaults to running in the foreground to see any log messages right away.
# To run this in the background, replace `--tty` AND `--interactive` with `--detach`.
.PHONY: docker_run_local_dev
docker_run_local_dev:
	$(DOCKER) run \
	--rm \
	--tty \
	--interactive \
	--publish 127.0.0.1:$(PORT):$(PORT)/tcp \
	--env PORT=$(PORT) \
	--env REACT_APP_API_URL=$(REACT_APP_API_URL) \
	--env REACT_APP_AUTH_SERVICE_URL=$(REACT_APP_AUTH_SERVICE_URL) \
	$(LOCAL_DOCKER_IMAGE)


# Link the BFF API client package(s) locally
# See https://docs.npmjs.com/cli/v9/commands/npm-link
# See https://www.geeksforgeeks.org/how-to-install-a-local-module-using-npm/
# See https://hirok.io/posts/avoid-npm-link#4-unexpected-link-removal
.PHONY: npm_link
npm_link:
	npm link @cubeca/bff-client-oas-axios @cubeca/bff-auth-client-oas-axios

.PHONY: npm_link_check
npm_link_check:
	ls -la ./node_modules/\@cubeca
