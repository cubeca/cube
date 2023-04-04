FROM node:16.19.1-bullseye-slim AS builder

ENV PORT=4551

# This is also used as default values for the environments variables.
COPY .env.example /work/.env.example

COPY package.json /work/package.json
COPY package-lock.json /work/package-lock.json
COPY tsconfig.json /work/tsconfig.json

# See https://docs.docker.com/engine/reference/builder/#copy
# > If <src> is a directory, the entire contents of the directory are copied, including filesystem metadata.
# > NOTE: The directory itself is not copied, just its contents.
COPY src /work/src/

WORKDIR /work/

RUN npm install

RUN npm run build

################################################################################

FROM node:16.19.1-bullseye-slim AS server

COPY --from=builder /work/build /work/build/
COPY --from=builder /work/.env.example /work/.env.example
COPY --from=builder /work/package.json /work/package.json
COPY --from=builder /work/package-lock.json /work/package-lock.json

WORKDIR /work/

RUN npm install --omit=dev

EXPOSE ${PORT}

ENTRYPOINT npm run serve
