# https://lithic.tech/blog/2020-05/makefile-dot-env
include ./.env.example
export
DOCKER_ENV_FILE_PARAM = --env-file ./.env.example
ENV_FILE = ./.env.example
ifneq (,$(wildcard ./.env))
	include ./.env
	export
	DOCKER_ENV_FILE_PARAM += --env-file ./.env
	ENV_FILE = ./.env
endif

DOCKER ?= docker

export PROJECT_NAME ?= cube_local_dev
PROJECT_DOCKER_COMPOSE = $(DOCKER) compose --project-name $(PROJECT_NAME) --file ./docker-compose.yaml --project-directory . $(DOCKER_ENV_FILE_PARAM)

.PHONY: up
up:
	$(PROJECT_DOCKER_COMPOSE) up --detach --force-recreate

.PHONY: down
down:
	$(PROJECT_DOCKER_COMPOSE) down

.PHONY: clean
clean:
	-$(PROJECT_DOCKER_COMPOSE) rm
	-$(DOCKER) container rm \
		$(PROJECT_NAME)_bff \
		$(PROJECT_NAME)_cloudflare \
		$(PROJECT_NAME)_content \
		$(PROJECT_NAME)_identity \
		$(PROJECT_NAME)_profile
	-$(DOCKER) image rm \
		$(PROJECT_NAME)_bff \
		$(PROJECT_NAME)_cloudflare \
		$(PROJECT_NAME)_content \
		$(PROJECT_NAME)_identity \
		$(PROJECT_NAME)_profile

.PHONY: dbdel
dbdel:
	-$(DOCKER) volume rm \
		$(PROJECT_NAME)_pgdata

.PHONY: logs
logs:
	$(PROJECT_DOCKER_COMPOSE) logs --follow

.PHONY: login_%
login_%:
	$(DOCKER) exec -ti $(PROJECT_NAME)_$* bash

.PHONY: stop
stop:
	$(MAKE) down
	$(MAKE) clean

.PHONY: start
start:
	$(MAKE) up
	$(MAKE) logs

.PHONY: restart
restart:
	$(MAKE) stop
	$(MAKE) start
