FROM node:16.19.1-bullseye-slim AS builder

ENV GENERATE_SOURCEMAP=false

# This is also used as default values for the environments variables.
COPY .env.example /work/.env.example

COPY .eslintignore /work/.eslintignore
COPY .eslintrc.json /work/.eslintrc.json
COPY .prettierignore /work/.prettierignore
COPY .prettierrc /work/.prettierrc
COPY package.json /work/package.json
COPY package-lock.json /work/package-lock.json
COPY serve.json /work/serve.json
COPY tsconfig.json /work/tsconfig.json

# See https://docs.docker.com/engine/reference/builder/#copy
# > If <src> is a directory, the entire contents of the directory are copied, including filesystem metadata.
# > NOTE: The directory itself is not copied, just its contents.
COPY public /work/public/
COPY src /work/src/

WORKDIR /work/

RUN npm install

RUN npm run build

################################################################################

FROM node:16.19.1-bullseye-slim AS server

ENV PORT=4550

COPY --from=builder /work/build /work/build/
COPY --from=builder /work/.env.example /work/.env.example
COPY --from=builder /work/serve.json /work/serve.json

# See "Usage in Docker" section in https://www.npmjs.com/package/runtime-env-cra
COPY --from=builder /work/.env.example /work/.env

WORKDIR /work/

RUN npm install runtime-env-cra serve

EXPOSE ${PORT}

ENTRYPOINT ["/bin/sh", "-c", "NODE_ENV=production npx runtime-env-cra --config-name=./build/runtime-env.js && npx serve --cors --no-clipboard --config ../serve.json build"]
