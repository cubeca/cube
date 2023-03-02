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

export PROJECT_NAME ?= cube_cloudflare
PROJECT_DOCKER_COMPOSE = $(DOCKER) compose --project-name $(PROJECT_NAME) --file ./docker-compose.yaml --project-directory . $(DOCKER_ENV_FILE_PARAM)

LOCAL_DOCKER_IMAGE ?= cubeca/cloudflare:latest

export PORT ?= 3000

export JWT_TOKEN_SECRET ?= secret
export CLOUDFLARE_ACCOUNT_ID ?= __INVALID__
export CLOUDFLARE_API_TOKEN ?= __INVALID__
export CLOUDFLARE_STREAM_CUSTOMER_SUBDOMAIN ?= __INVALID__

export POSTGRES_DB ?= $(PROJECT_NAME)
export POSTGRES_USER ?= postgres
export POSTGRES_PASSWORD ?= postgres

.PHONY: up
up:
	MICROSERVICE_DOCKERFILE=editable.dockerfile $(PROJECT_DOCKER_COMPOSE) up --detach --force-recreate

.PHONY: up-prod
up-prod:
	MICROSERVICE_DOCKERFILE=Dockerfile $(PROJECT_DOCKER_COMPOSE) up --detach --force-recreate

.PHONY: test
test:
	MICROSERVICE_DOCKERFILE=editable.dockerfile $(PROJECT_DOCKER_COMPOSE) --profile test up --detach --force-recreate

.PHONY: down
down:
	MICROSERVICE_DOCKERFILE=editable.dockerfile $(PROJECT_DOCKER_COMPOSE) --profile test down

.PHONY: clean
clean:
	-MICROSERVICE_DOCKERFILE=editable.dockerfile $(PROJECT_DOCKER_COMPOSE) --profile test rm
	-$(DOCKER) container rm $(PROJECT_NAME)_microservice $(PROJECT_NAME)_db $(PROJECT_NAME)_testrunner
	-$(DOCKER) image rm $(PROJECT_NAME)_microservice $(PROJECT_NAME)_testrunner

.PHONY: logs
logs:
	$(PROJECT_DOCKER_COMPOSE) logs --follow

.PHONY: login
login:
	$(DOCKER) exec -ti $(PROJECT_NAME)_testrunner bash

.PHONY: login_ms
login_ms:
	$(DOCKER) exec -ti $(PROJECT_NAME)_microservice bash

# This "power-cycles" the Docker Compose setup.
# A.k.a. "have you turned it off and on again?"
# See https://en.wikipedia.org/wiki/SIGHUP
.PHONY: hup
hup:
	$(MAKE) down
	$(MAKE) clean
	$(MAKE) test
	$(MAKE) login_ms

.PHONY: docker_build
docker_build:
	$(DOCKER) buildx build \
	--file ./Dockerfile \
	--tag $(LOCAL_DOCKER_IMAGE) \
	--output=type=docker \
	.
