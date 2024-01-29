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

export PROJECT_NAME ?= cube_svc
PROJECT_DOCKER_COMPOSE = $(DOCKER) compose --project-name $(PROJECT_NAME) --file ./docker-compose.yaml --project-directory . $(DOCKER_ENV_FILE_PARAM)

LOCAL_DOCKER_IMAGE ?= cubeca/cube-svc:latest

export PORT ?= 3000

export JWT_TOKEN_SECRET ?= secret

.PHONY: docker_build
docker_build:
	$(DOCKER) buildx build \
	--file ./Dockerfile \
	--tag $(LOCAL_DOCKER_IMAGE) \
	--output=type=docker \
	.