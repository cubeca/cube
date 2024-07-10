# CubeCommons (https://cubecommons.ca)

CubeCommons aggregates the video, audio, digital publications and activity booklets by arts organizations and artists across northern Turtle Island (Canada). This repository contains the front-end react app, express services and database schema details to run the project.

# File Structure
## /client
This is the front-end user interface in the form of a typical React application.

# /services
This includes the cube-svc microservice that supports all operations.  Additionally, there is a VTT service responsible for coordinating subtitle generation between GCP and OpenAI.

- */cube-svc/src/cloudflare:* APIs related to uploading files to cloudflare. Specifically can retrieve a TUS upload url for media files on behalf of the client.
- */cube-svc/src/content:* APIs related to storing metadata about upload files and file ids for retrieving the actual content from cloudflare..
- */cube-svc/src/identity:* APIs related to authenticating the user and creating a user account, email verification and password management. This service is responsible for providing an authentication jwt used to identify the user.
- */cube-svc/src/profile:* APIs related to operations of a creator profile.
- */vtt:* Set of functions designed for a publisher-subscriber model generating subtitles (optionally requested by the user) upon successful content uploads.


# Project Infrastructure

## Database
CubeCommons utilizes a serverless database solution called CockroachDB.  Cockroach Labs offers a generous free tier that auto-scales based on demand.  You may use any database solution you wish.  The schema detials are outlined below.

## Cloud Infrastructure
The above services are packaged into Docker containers and deployed to Google Cloud Run for resource, instance and scalability management.

## Front-End Hosting
The built front-end react app is hosted on Cloudflare pages.  There is some light configuration in the tsconfig.json to support this deployment.  Cloudflare Pages offers a generous free-tier and automatic deployments and may be switched out for any alternative hosting option.

# Setup
## 1. Create Database Tables

- Install/setup account with a postgres db solution.
- Create a database called `cube` with tables: `content`, `files`, `playlists`, `profiles`, `users` and `vtt`.
- Deploy the schemas located in */sql/cockroach_init.sql*

## 2. Email Provider
Email notifications sent to users for activities like account creation or password management are coordinated with Brevo. Brevo assists with template management, newsletter campaigns and is the mail server.

## 3. Configure Environment Vars
```
cd services/cube-svc/
cp .env.example .env
```

- Add the values for the database keys to `.env`
- Update the values `COCKROACH_DB_CONNECTION_STRING`, `BREVO_API_KEY` and everything prefixed with `CLOUDFLARE_`.
- For the `JWT_TOKEN_SECRET` it can be any value, but must match the value used for the identity server (configured in GCP).

```
npm i
npm run start
```

The service will now be running on [http://localhost:8080](http://localhost:8080)

## 4. Start the Client

```
cd client
cp .env.example .env
```
- Update the values `REACT_APP_CUBE_SVC_URL` to the endpoint configured above.
- Update `REACT_APP_HCAPTCHA_KEY` with the key of your hcaptcha account.

```
npm i
npm run start
```

# Styleguide

Site styles can be referenced in the [theme file](https://github.com/cubeca/cube_ui/blob/main/client/src/theme/index.ts)