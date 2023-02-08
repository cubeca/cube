FROM node:16.19.0-bullseye-slim

RUN apt-get update \
    && \
    apt-get install -y \
    bash \
    make \
    vim \
    && \
    apt clean

COPY .env /work/.env
COPY .env.example /work/.env.example
COPY .eslintignore /work/.eslintignore
COPY .eslintrc.json /work/.eslintrc.json
COPY .prettierignore /work/.prettierignore
COPY .prettierrc /work/.prettierrc
COPY Makefile.in-container.mk /work/Makefile
COPY package.json /work/package.json
COPY package-lock.json /work/package-lock.json
COPY tsconfig.json /work/tsconfig.json

# See https://docs.docker.com/engine/reference/builder/#copy
# > If <src> is a directory, the entire contents of the directory are copied, including filesystem metadata.
# > NOTE: The directory itself is not copied, just its contents.
COPY public /work/public/
COPY src /work/src/
COPY node_modules /work/node_modules/

WORKDIR /work/

ENTRYPOINT ["/bin/bash"]
