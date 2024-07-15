## Table of Contents
- [CubeCommons](#cubecommons)
  - [File Structure](#file-structure)
    - [/client](#client)
    - [/services](#services)
  - [Project Infrastructure](#project-infrastructure)
    - [Database](#database)
      - [User Permissions](#user-permissions)
    - [Cloud Infrastructure](#cloud-infrastructure)
    - [Front-End Hosting](#front-end-hosting)
  - [Setup](#setup)
    - [1. Create Database Tables](#1-create-database-tables)
    - [2. Email Provider](#2-email-provider)
    - [3. Configure Environment Variables](#3-configure-environment-variables)
    - [4. Start the Client](#4-start-the-client)
- [Styleguide](#styleguide)
  - [Contributing](#contributing)
  - [License](#license)
  - [Contact](#contact)
  - [Known Issues](#known-issues)
  - [Changelog](#changelog)
    - [\[Version 1.0.0\]](#version-100)

# CubeCommons

CubeCommons aggregates video, audio, digital publications, and activity booklets by arts organizations and artists across northern Turtle Island (Canada). This repository contains the front-end React app, Express services, and database schema details to run the project.

## File Structure

### /client

This is the front-end user interface in the form of a typical React application.

### /services

This includes the `cube-svc` microservice that supports all operations. Additionally, there is a VTT service responsible for coordinating subtitle generation between GCP and OpenAI.

- **/cube-svc/src/cloudflare:** APIs related to uploading files to Cloudflare. Specifically, it can retrieve a TUS upload URL for media files on behalf of the client.
- **/cube-svc/src/content:** APIs related to storing metadata about uploaded files and file IDs for retrieving the actual content from Cloudflare.
- **/cube-svc/src/identity:** APIs related to authenticating the user, creating a user account, email verification, and password management. This service is responsible for providing an authentication JWT used to identify the user.
- **/cube-svc/src/profile:** APIs related to operations of a creator profile.
- **/vtt:** Set of functions designed for a publisher-subscriber model generating subtitles (optionally requested by the user) upon successful content uploads.

## Project Infrastructure

### Database

CubeCommons utilizes a serverless database solution called CockroachDB. Cockroach Labs offers a generous free tier that auto-scales based on demand. You may use any database solution you wish. The schema details are outlined below.

`users`: table for authentication and authorization information as well as user account statuses.
`profiles`: table for organization related information, is associated to a user identity 1:1.
`playlists`: table for playlist related information including basic metadata and a list of associated content items.
`files`: table for data related to cloudflare information like upload endpoints and external data required to interact with cloudflare.
`content`: table for metadata related to a piece of content on CubeCommons like description, tags, contributors, etc.
`vtt`: table for metadata related to generated or uploaded VTT files associated to a piece of content.

#### User Permissions
There is a small set of user permissions that are associated to the user record allowing actions to be taken.  The thresholds are:
- `anonymous`: any user visiting the site gets the anonymous permission.
- `active`: any authenticated user who has completed the user registration has the active permission.
- `contentEditor`: any authenticated user who has completed profile registration has the contentEditor permission.

### Cloud Infrastructure

The above services are packaged into Docker containers and deployed to Google Cloud Run for resource, instance, and scalability management.

### Front-End Hosting

The built front-end React app is hosted on Cloudflare Pages. There is some light configuration in the `tsconfig.json` to support this deployment. Cloudflare Pages offers a generous free tier and automatic deployments and may be switched out for any alternative hosting option.

## Setup

### 1. Create Database Tables

- Install/setup an account with a PostgreSQL database solution.
- Create a database called `cube` with tables: `content`, `files`, `playlists`, `profiles`, `users`, and `vtt`.
- Deploy the schemas located in `/sql/cockroach_init.sql`.

### 2. Email Provider

Email notifications sent to users for activities like account creation or password management are coordinated with Brevo. Brevo assists with template management, newsletter campaigns, and is the mail server.

### 3. Configure Environment Variables

```sh
cd services/cube-svc/
cp .env.example .env
```

- Add the values for the database keys to `.env`.
- Update the values `COCKROACH_DB_CONNECTION_STRING`, `BREVO_API_KEY` and everything prefixed with `CLOUDFLARE_`.
- For the `JWT_TOKEN_SECRET` it can be any value, but must match the value used for the identity server (configured in GCP).

```
npm i
npm run start
```

The service will now be running on [http://localhost:8080](http://localhost:8080)

### 4. Start the Client

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

Site styles can be referenced in the [theme file](https://github.com/cubeca/cube_ui/blob/main/client/src/theme/index.ts).

## Contributing

We welcome contributions to CubeCommons! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them.
4. Push your changes to your fork.
5. Open a pull request to the main repository.

Please ensure your code follows the project's coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For any questions or support, please contact us at [support@cubecommons.ca](mailto:support@cubecommons.ca).

## Known Issues

A section to document any known issues or bugs.

- Issue 1: VTT Generation is currently disabled.  Due to some challenges with the publisher-subscriber model, it is turned off.

Please report any new issues in the GitHub issues section.

## Changelog

### [Version 1.0.0]

- Initial release.