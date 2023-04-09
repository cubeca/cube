
DOCKER ?= docker

LOCAL_DOCKER_IMAGE ?= cubeca/bff:latest

.PHONY: docker_build
docker_build:
	$(DOCKER) buildx build \
	--file ./Dockerfile \
	--tag $(LOCAL_DOCKER_IMAGE) \
	--output=type=docker \
	.
