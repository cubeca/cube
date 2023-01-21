# https://lithic.tech/blog/2020-05/makefile-dot-env
ifneq (,$(wildcard ./.env))
        include .env
        export
        DOCKER_ENV_FILE_PARAM = --env-file .env
endif

DOCKER ?= docker
DOCKER_COMPOSE ?= docker-compose

export PROJECT_NAME ?= cube_frontend
PROJECT_DOCKER_COMPOSE = $(DOCKER_COMPOSE) --project-name $(PROJECT_NAME) --file ./docker-compose.yaml --project-directory . --env-file ./.env

FRONTEND_DOCKER_IMAGE ?= cubeca/frontend:latest

PORT ?= 8080
NPMRC_FILEPATH ?= $(HOME)/.npmrc
API_URL ?= http://localhost:4550

.PHONY: sync
sync:
	./interimapiserver/scripts/sync.sh

.PHONY: up
up: sync
	$(PROJECT_DOCKER_COMPOSE) up -d --force-recreate

.PHONY: down
down:
	$(PROJECT_DOCKER_COMPOSE) down

.PHONY: clean
clean:
	-$(PROJECT_DOCKER_COMPOSE) rm
	-$(DOCKER) container rm $(PROJECT_NAME)_frontend $(PROJECT_NAME)_interimapiserver
	-$(DOCKER) image rm $(PROJECT_NAME)_frontend $(PROJECT_NAME)_interimapiserver

.PHONY: logs
logs:
	$(PROJECT_DOCKER_COMPOSE) logs -f

.PHONY: login_frontend
login_frontend:
	$(DOCKER) exec -ti $(PROJECT_NAME)_frontend bash

.PHONY: login_interimapiserver
login_interimapiserver:
	$(DOCKER) exec -ti $(PROJECT_NAME)_interimapiserver bash

.PHONY: check_user_npmrc
check_npmrc:
	echo "TODO check that $NPMRC_FILEPATH exists"

.PHONY: docker_build
docker_build: check_user_npmrc
	$(DOCKER) buildx build \
	--file ./Dockerfile \
	--tag $(FRONTEND_DOCKER_IMAGE) \
	--output=type=docker \
	--secret id=npmrc,src=$(NPMRC_FILEPATH) \
	.

.PHONY: docker_run
docker_run:
	$(DOCKER) run \
	--rm \
	--tty \
	--interactive \
	--publish 127.0.0.1:$(PORT):$(PORT)/tcp \
	--env PORT=$(PORT) \
	--env REACT_APP_API_URL=$(API_URL) \
	--env REACT_APP_ENABLE_MOCK=false \
	$(FRONTEND_DOCKER_IMAGE)


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
