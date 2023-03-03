# Cube Commons

This project is a monorepo containing the front-end ui and services required to run the CubeCommons app.

# File Structure

## /client

This is the front-end UI in the form of a typical React App

# /mock-api-server

This is an api-server that allows for local testing of the api that will handle all the data queries for profiles, content, etc

# /services

This includes the micro-services that will be deployed to support the app

- */services/cloudflare:* APIs related to uploading files to cloudflare. Specifically can retrieve a TUS upload url for media files on behalf of the client.
- */services/identity:* APIs related to authenticating the user and creating a user account, email verification and password resets. This service is responsible for providing an authentication jwt used to identify the user to other services.

# Quick Start

## 1. Start the Cloudflare Service

- Install a postgres db and set user/password as desired.
- Create a database called 'cube'

```
cd services/cloudflare
cp .env.example .env
```

- Add the values for the API keys for cloudflare to `.env`
- Update the values for `PGUSER` and `PGPASSWORD` to match the admin credentials for your db
- For the `JWT_TOKEN_SECRET` it can be any value, but must match the value used for the identity server.

```
npm i
npm run migrate:up
npm run start
```

The service will now be running on [http://localhost:8080](http://localhost:8080)

## 2. Start the Identity Service

- You can use the same postgres as above. If using a different postgres server and/or db, update the `.env` values accordingly.

```
cd services/identity
cp .env.example .env
```

- Update the values for `PGUSER` and `PGPASSWORD` to match the admin credentials for your db
- For the `JWT_TOKEN_SECRET` it can be any value, but must match the value used for the cloudflare server.
- The `ENCRYPT_SECRET` can be any value

```
npm i
npm run migrate:up
npm run start
```

The service will now be running on [http://localhost:8081](http://localhost:8081)

NOTE: A test user is created in the migration with the following credentials:

username: firstuser@cubecommons.ca
password: abc123456789***


## 3. Start the Mock API Server

```
cd mock-api-server
cp .env.example .env
```

- Ensure the valued for the `CLOUDFLARE_SERVICE_API_URL` matches the Cloudflare service. Defaults to `localhost:8080`

```
npm i
npm run start
```

The service will now be running on [http://localhost:4550](http://localhost:4550)

## 4. Start the Client

```
cd client
cp .env.example .env
make npm_link
npm i
npm run start
```

