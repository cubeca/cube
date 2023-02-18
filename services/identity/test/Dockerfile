FROM node:16.19.0-bullseye-slim

RUN apt-get update \
    && \
    apt-get install -y \
    bash \
    make \
    vim \
    postgresql-client-13 \
    && \
    apt clean

# This is also used as default values for the environments variables.
COPY .env.example /work/.env.example

# This Dockerfile will be run in a Docker Context of the parent directory i.e. `/services/identity/`
COPY test/jest.config.js /work/jest.config.js
COPY test/package.json /work/package.json
COPY test/package-lock.json /work/package-lock.json
COPY test/tsconfig.json /work/tsconfig.json

# See https://docs.docker.com/engine/reference/builder/#copy
# > If <src> is a directory, the entire contents of the directory are copied, including filesystem metadata.
# > NOTE: The directory itself is not copied, just its contents.
COPY test/scripts /work/scripts/
COPY test/src /work/src/

WORKDIR /work/

RUN npm install

# RUN npm run build

# ENTRYPOINT npm run test
ENTRYPOINT ["/bin/bash", "-c", "echo 'Waiting for you to log into this container via `make login`'; while true; do sleep 99999; done"]
