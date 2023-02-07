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
DOCKER_COMPOSE ?= docker-compose

export PROJECT_NAME ?= cube_cloudflare
PROJECT_DOCKER_COMPOSE = $(DOCKER_COMPOSE) --project-name $(PROJECT_NAME) --file ./docker-compose.yaml --project-directory . $(DOCKER_ENV_FILE_PARAM)

LOCAL_DOCKER_IMAGE ?= cubeca/cloudflare:latest

export PORT ?= 3000

export JWT_TOKEN_SECRET ?= secret
export CLOUDFLARE_ACCOUNT_ID ?= __INVALID__
export CLOUDFLARE_API_TOKEN ?= __INVALID__

export POSTGRES_DB ?= $(PROJECT_NAME)
export POSTGRES_USER ?= postgres
export POSTGRES_PASSWORD ?= postgres

.PHONY: up
up:
	$(PROJECT_DOCKER_COMPOSE) up -d --force-recreate

.PHONY: down
down:
	$(PROJECT_DOCKER_COMPOSE) down

.PHONY: clean
clean:
	-$(PROJECT_DOCKER_COMPOSE) rm
	-$(DOCKER) container rm $(PROJECT_NAME)_microservice $(PROJECT_NAME)_db
	-$(DOCKER) image rm $(PROJECT_NAME)_microservice

.PHONY: logs
logs:
	$(PROJECT_DOCKER_COMPOSE) logs -f

.PHONY: login
login:
	$(DOCKER) exec -ti $(PROJECT_NAME)_microservice bash

.PHONY: docker_build
docker_build:
	$(DOCKER) buildx build \
	--file ./Dockerfile \
	--tag $(LOCAL_DOCKER_IMAGE) \
	--output=type=docker \
	.
