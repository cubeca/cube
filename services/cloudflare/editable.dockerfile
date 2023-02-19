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

ENV PORT=4551

COPY package.json /work/package.json
COPY package-lock.json /work/package-lock.json
COPY tsconfig.json /work/tsconfig.json

WORKDIR /work/

RUN npm install

EXPOSE ${PORT}

ENTRYPOINT ["/bin/bash", "-c", "echo 'Waiting for you to log into this container via `make login_ms`'; while true; do sleep 99999; done"]
