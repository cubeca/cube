# Cube Commons

This project is a monorepo containing the front-end ui and services required to run the CubeCommons app.

# File Structure

## /client

This is the front-end UI in the form of a typical React App

# /services

This includes the micro-services that will be deployed to support the app

- */services/cloudflare:* APIs related to uploading files to cloudflare. Specifically can retrieve a TUS upload url for media files on behalf of the client.
- */services/content:* APIs related to storing metadata about upload files and file ids for retrieving the actual uploaded files.
- */services/identity:* APIs related to authenticating the user and creating a user account, email verification and password resets. This service is responsible for providing an authentication jwt used to identify the user to other services.
- */services/profile:* APIs related to authenticating the user and creating a user account, email verification and password resets. This service is responsible for providing an authentication jwt used to identify the user to other services.

# Quick Start

## 1. Start the Cloudflare Service

- Install a postgres db and set user/password as desired.
- Create a database called `cube_cloudflare`

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

## 2. Start the Content Service

- Using the same postgres as above, create a database called `cube_content`

```
cd services/content
cp .env.example .env
```

- Update the values for `PGUSER` and `PGPASSWORD` to match the admin credentials for your db
- For the `JWT_TOKEN_SECRET` it can be any value, but must match the value used as the other microservices.

```
npm i
npm run migrate:up
npm run start
```

The service will now be running on [http://localhost:8081](http://localhost:8081)

## 3. Start the Identity Service

- Using the same postgres as above, create a database called `cube_identity`. If using a different postgres server and/or db, update the `.env` values accordingly.

```
cd services/identity
cp .env.example .env
```

- Update the values for `PGUSER` and `PGPASSWORD` to match the admin credentials for your db
- For the `JWT_TOKEN_SECRET` it can be any value, but must match the value used as the other microservices.
- The `ENCRYPT_SECRET` can be any value

```
npm i
npm run migrate:up
npm run start
```

The service will now be running on [http://localhost:8082](http://localhost:8082)

NOTE: A test user is created in the migration with the following credentials:

username: firstuser@cubecommons.ca
password: abc123456789***

## 4. Start the Profile Service

- Using the same postgres as above, create a database called `cube_profile`. If using a different postgres server and/or db, update the `.env` values accordingly.

```
cd services/profile
cp .env.example .env
```

- Update the values for `PGUSER` and `PGPASSWORD` to match the admin credentials for your db
- For the `JWT_TOKEN_SECRET` it can be any value, but must match the value used as the other microservices.

```
npm i
npm run migrate:up
npm run start
```

The service will now be running on [http://localhost:8083](http://localhost:8083)

Note: A sample profile is created that can be used with the sample user to get the app started. In order to set it up, the
profile id must be updated in the users table. Using a Postgres GUI such as pgAdmin

```
# in the cube_profiles db
select * from profiles

# copy the value for 'id'

# in the cube_identity db
select * from users

# paste the value copied above into the profileId column for "First User"
# save the database to store the updated value.
```

## 4. Start the Client

```
cd client
cp .env.example .env
# make npm_link (not sure if this step is needed any more since there is now a venders directory)
npm i
npm run start
```

