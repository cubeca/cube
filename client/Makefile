# https://lithic.tech/blog/2020-05/makefile-dot-env
include .env.example
export
DOCKER_ENV_FILE_PARAM = --env-file .env.example
export ENV_FILE = .env.example
ifneq (,$(wildcard ./.env))
	include .env
	export
	DOCKER_ENV_FILE_PARAM = --env-file .env.example --env-file .env
	export ENV_FILE = .env
endif

DOCKER ?= docker

export PROJECT_NAME ?= cube_frontend
PROJECT_DOCKER_COMPOSE = $(DOCKER) compose --project-name $(PROJECT_NAME) --file ./docker-compose.yaml --project-directory . $(DOCKER_ENV_FILE_PARAM)

LOCAL_DOCKER_IMAGE ?= cubeca/frontend:latest

export PORT ?= 3000

.PHONY: up
up:
	MICROSERVICE_DOCKERFILE=editable.dockerfile $(PROJECT_DOCKER_COMPOSE) up --detach --force-recreate

.PHONY: up-prod
up-prod:
	MICROSERVICE_DOCKERFILE=Dockerfile $(PROJECT_DOCKER_COMPOSE) up --detach --force-recreate

.PHONY: down
down:
	MICROSERVICE_DOCKERFILE=editable.dockerfile $(PROJECT_DOCKER_COMPOSE) down

.PHONY: clean
clean:
	-MICROSERVICE_DOCKERFILE=editable.dockerfile $(PROJECT_DOCKER_COMPOSE) rm
	-$(DOCKER) container rm $(PROJECT_NAME)_frontend
	-$(DOCKER) image rm $(PROJECT_NAME)_frontend

.PHONY: logs
logs:
	$(PROJECT_DOCKER_COMPOSE) logs --follow

.PHONY: login
login:
	$(DOCKER) exec -ti $(PROJECT_NAME)_frontend bash

# This "power-cycles" the Docker Compose setup.
# A.k.a. "have you turned it off and on again?"
# See https://en.wikipedia.org/wiki/SIGHUP
.PHONY: hup
hup:
	$(MAKE) bye
	$(MAKE) up
	$(MAKE) login

.PHONY: bye
bye:
	$(MAKE) down
	$(MAKE) clean


.PHONY: docker_build
docker_build:
	$(DOCKER) buildx build \
	--file ./Dockerfile \
	--build-arg GENERATE_SOURCEMAP=$(GENERATE_SOURCEMAP) \
	--tag $(LOCAL_DOCKER_IMAGE) \
	--output=type=docker \
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
	--env REACT_APP_CLOUDFLARE_SERVICE_URL=$(REACT_APP_CLOUDFLARE_SERVICE_URL) \
	--env REACT_APP_CONTENT_SERVICE_URL=$(REACT_APP_CONTENT_SERVICE_URL) \
	--env REACT_APP_AUTH_SERVICE_URL=$(REACT_APP_AUTH_SERVICE_URL) \
	--env REACT_APP_PROFILE_SERVICE_URL=$(REACT_APP_PROFILE_SERVICE_URL) \
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


.PHONY: vendor_update
vendor_update:
	./scripts/vendor_update.sh
