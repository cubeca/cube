
DOCKER ?= docker
DOCKER_COMPOSE ?= docker-compose

export PROJECT_NAME ?= cube_frontend
PROJECT_DOCKER_COMPOSE = $(DOCKER_COMPOSE) --project-name $(PROJECT_NAME) --file ./docker-compose.yaml --project-directory . --env-file ./.env

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
