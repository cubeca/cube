FROM node:16.19.0-bullseye-slim

RUN apt-get update \
    && \
    apt-get install -y \
    bash=5.1-2+deb11u1 \
    make=4.3-4.1 \
    vim=2:8.2.2434-3+deb11u1 \
    && \
    apt clean

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

WORKDIR /work/

RUN --mount=type=secret,id=npmrc,required=true,target=/root/.npmrc npm i

# # TODO make it runnable from a built app
# RUN npm run build

EXPOSE 8080

# # TODO make it runnable from a built app
# ENTRYPOINT npx react-inject-env set && npx http-server build

ENTRYPOINT npm run start
