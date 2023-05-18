# https://lithic.tech/blog/2020-05/makefile-dot-env
include ../.env.example
export
include ../../identity/.env.example
export
include ../../profile/.env.example
export
DOCKER_ENV_FILE_PARAM = --env-file ../.env.example --env-file ../../identity/.env.example --env-file ../../profile/.env.example
GATEWAY_ENV_FILE = ../.env.example
ENV_FILE = ../../identity/.env.example
PROFILE_MOCK_ENV_FILE = ../../profile/.env.example
ifneq (,$(wildcard ../.env))
	include ../.env
	export
	DOCKER_ENV_FILE_PARAM += --env-file ../.env
	GATEWAY_ENV_FILE = ../.env
endif
ifneq (,$(wildcard ../../identity/.env))
	include ../../identity/.env
	export
	DOCKER_ENV_FILE_PARAM += --env-file ../../identity/.env
	ENV_FILE = ../../identity/.env
endif
ifneq (,$(wildcard ../../profile/.env))
	include ../../profile/.env
	export
	DOCKER_ENV_FILE_PARAM += --env-file ../../profile/.env
	PROFILE_MOCK_ENV_FILE = ../../profile/.env
endif

DOCKER ?= docker

export PROJECT_NAME ?= cube_bff_x_identity
PROJECT_DOCKER_COMPOSE = $(DOCKER) compose --project-name $(PROJECT_NAME) --file ./bff-x-identity.docker-compose.yaml --project-directory . $(DOCKER_ENV_FILE_PARAM)

export PORT ?= 3000
export GATEWAY_PORT ?= 3000

export JWT_TOKEN_SECRET ?= secret
export ENCRYPT_SECRET ?= encrypt_secret

export PROFILE_SERVICE_URL ?= http://localhost:4052

export POSTGRES_DB ?= $(PROJECT_NAME)
export POSTGRES_USER ?= postgres
export POSTGRES_PASSWORD ?= postgres

.PHONY: up
up:
	MICROSERVICE_DOCKERFILE=editable.dockerfile GATEWAY_DOCKERFILE=editable.dockerfile $(PROJECT_DOCKER_COMPOSE) up --detach --force-recreate

.PHONY: up-prod
up-prod:
	MICROSERVICE_DOCKERFILE=Dockerfile GATEWAY_DOCKERFILE=Dockerfile $(PROJECT_DOCKER_COMPOSE) up --detach --force-recreate

.PHONY: test
test:
	MICROSERVICE_DOCKERFILE=editable.dockerfile GATEWAY_DOCKERFILE=editable.dockerfile $(PROJECT_DOCKER_COMPOSE) --profile test up --detach --force-recreate

.PHONY: down
down:
	MICROSERVICE_DOCKERFILE=editable.dockerfile GATEWAY_DOCKERFILE=editable.dockerfile $(PROJECT_DOCKER_COMPOSE) --profile test down

.PHONY: clean
clean:
	-MICROSERVICE_DOCKERFILE=editable.dockerfile GATEWAY_DOCKERFILE=editable.dockerfile $(PROJECT_DOCKER_COMPOSE) --profile test rm
	-$(DOCKER) container rm $(PROJECT_NAME)_microservice $(PROJECT_NAME)_db $(PROJECT_NAME)_gateway $(PROJECT_NAME)_testrunner $(PROJECT_NAME)_profile_mock
	-$(DOCKER) image rm $(PROJECT_NAME)_microservice $(PROJECT_NAME)_gateway $(PROJECT_NAME)_testrunner $(PROJECT_NAME)_profile_mock

.PHONY: logs
logs:
	$(PROJECT_DOCKER_COMPOSE) logs --follow

.PHONY: login
login:
	$(DOCKER) exec -ti $(PROJECT_NAME)_testrunner bash

.PHONY: login_gw
login_gw:
	$(DOCKER) exec -ti $(PROJECT_NAME)_gateway bash

.PHONY: login_mock
login_mock:
	$(DOCKER) exec -ti $(PROJECT_NAME)_profile_mock bash

.PHONY: login_ms
login_ms:
	$(DOCKER) exec -ti $(PROJECT_NAME)_microservice bash

.PHONY: bye
bye:
	$(MAKE) down
	$(MAKE) clean

# This "power-cycles" the Docker Compose setup.
# A.k.a. "have you turned it off and on again?"
# See https://en.wikipedia.org/wiki/SIGHUP
.PHONY: hup
hup:
	$(MAKE) down
	$(MAKE) clean
	$(MAKE) test
	$(MAKE) login_ms
