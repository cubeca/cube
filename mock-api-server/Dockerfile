FROM node:16.17.0-bullseye-slim

RUN apt-get update \
    && \
    apt-get install -y \
    bash=5.1-2+deb11u1 \
    make=4.3-4.1 \
    vim=2:8.2.2434-3+deb11u1 \
    && \
    apt clean

COPY .env /work/.env
COPY .env.example /work/.env.example
COPY Makefile.in-container.mk /work/Makefile
COPY package.json /work/package.json
COPY package-lock.json /work/package-lock.json
COPY tsconfig.json /work/tsconfig.json
# See https://docs.docker.com/engine/reference/builder/#copy
# > If <src> is a directory, the entire contents of the directory are copied, including filesystem metadata.
# > NOTE: The directory itself is not copied, just its contents.
COPY src /work/src/

WORKDIR /work/

RUN make dependencies

ENTRYPOINT ["/bin/bash", "-c", "echo 'Waiting for you to log into this container via `make login`'; while true; do sleep 99999; done"]
