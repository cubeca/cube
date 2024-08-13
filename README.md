## Table of Contents - trying branch restrictions

- [CubeCommons](#cubecommons)
  - [File Structure](#file-structure)
    - [/client](#client)
    - [/services](#services)
  - [Project Infrastructure](#project-infrastructure)
    - [Database](#database)
      - [User Permissions](#user-permissions)
    - [Cloud Infrastructure](#cloud-infrastructure)
    - [Front-End Hosting](#front-end-hosting)
  - [Governance](#governance)
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

- `users`: table for authentication and authorization information as well as user account statuses.
- `profiles`: table for organization related information, is associated to a user identity 1:1.
- `playlists`: table for playlist related information including basic metadata and a list of associated content items.
- `files`: table for data related to cloudflare information like upload endpoints and external data required to interact with cloudflare.
- `content`: table for metadata related to a piece of content on CubeCommons like description, tags, contributors, etc.
- `vtt`: table for metadata related to generated or uploaded VTT files associated to a piece of content.

#### User Permissions

There is a small set of user permissions that are associated to the user record allowing actions to be taken. The thresholds are:

- `anonymous`: any user visiting the site gets the anonymous permission (regardless if they are authenticated or not).
- `active`: any user who has completed the user registration and verified their email has the active permission.
- `contentEditor`: any authenticated user who has completed profile registration has the contentEditor permission.

### Cloud Infrastructure

The above services are packaged into Docker containers and deployed to Google Cloud Run for resource, instance, and scalability management. These docker containers can be deployed using any server structure that you wish.

### Front-End Hosting

The built front-end React app is hosted on Cloudflare Pages. There is some light configuration in the `tsconfig.json` to support this deployment. Cloudflare Pages offers a generous free tier and automatic deployments and may be switched out for any alternative hosting option.

## Governance

CubeCommons uses a third-party tool called Gov4Git to govern its' issues and pull requests. This Tool was developed by Digital Minister Audrey Tang (they/them) and their collaborators – architects of Taiwan’s internationally acclaimed digital democracy technology. 
Learn more about Audrey Tang: https://www.plurality.net/
Gov4git installation links and instructions can be found here: https://gitrules.ai/

Follow these steps to get started with Gov4Git for CubeCommons:

1. Create a GitHub profile https://github.com/
2. Download Gov4Git on MacOS or Windows using the links found here: https://github.com/gov4git/gov4git/blob/v2/README.md
3. Once installed, open Gov4Git on your computer and follow the login and verification instructions using your GitHub account details.
   - Login with the Verify link, copy the verification code and enter it when prompted.
   - Once Verified, the Gove4Git desktop app should show a button called “Join a community”, this can always be found under settings. Under "Join Community" there is an input titled "Community URL". Paste this CubeCommons URL: “https://github.com/cubeca/cube”
4. Approval may take a few minutes.

Requesting Voting Tokens:
5. Once approved, go back to your browser and login to your GitHub account (if you're not already), click on the GitHub logo - found in the top left corner (looks like a small cat) - this should take you to your dashboard.
6. On the left hand side under repositories, you'll see the ‘cubeca’ repository that you’ve just joined.
7. click on the 'cubeca' repository this will take you to a new page on Github.
8. Under the Github logo in the top navigation bar is a secondary navigation bar with the buttons "code", "Issues", "Pull requests" etc. Click “Issues”, this will take you to a new page on GitHub
9. On the right hand side of this new page, click a green button titled “New Issue” and create a request for voting tokens.

Formatting "New Issues" as Requests or Proposals:
 * In the input called "Add a title" write:
'[Your Org Name] Requests Voting Tokens as a Member of CubeCommons'
 * In the input called "Add a description write:
'[Your Org Name] has a Creator profile on CubeCommons and requests tokens to create and vote on proposals.'
 * On the right hand side click on the header "label" - search `gov4git:managed` and select it. This will ensure your issue is pushed to the CubeCommons Gov4Git desktop app for tokens to be granted or the community to vote on.
 * This is the same process for idea proposals, which can include a simple description about a function you would like to propose the community prioritize, or a language or policy change. It is a different process to submit code for review by the community. See Section below called (##contributing)


## Setup

### 1. Create Database Tables

- Install/setup an account with a PostgreSQL database solution. CubeCommons utilizes Cockroach Lab's CockroachDB to host a cloud based scalable database
- Create a database called `cube` with tables: `content`, `files`, `playlists`, `profiles`, `users`, and `vtt`.
- Deploy the schemas located in `/sql/cockroach_init.sql`.

### 2. Email Provider

Email notifications sent to users for activities like account creation or password management are coordinated with Brevo. Brevo assists with template management, newsletter campaigns, and is the mail server. CubeCommons uses Brevo's APIs to implement this functionality so a Brevo account is a requirement to proceed.

### 3. Configure Environment Variables

```
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

We welcome code contributions to CubeCommons! This can be new features or components that you have developed after forking our code. Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them to your branch.
4. Push your changes to your fork.
5. Open a pull request to the main repository.
6. Ensure that you add the `gov4git:managed` label to your PR to allow the Gov4Git bot to parse your request.

Please ensure your code follows the project's coding standards and includes appropriate tests.

More detailed instructions for contributing to the project can be found in [README_CONTRIBUTIONS.md](README_CONTRIBUTIONS.md)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For any questions or support, please contact us at [support@cubecommons.ca](mailto:support@cubecommons.ca).

## Known Issues

A section to document any known issues or bugs.

- Issue 1: VTT Generation is currently disabled. Due to some challenges with the publisher-subscriber model, it is turned off.

Please report any new issues in the GitHub issues section.

## Changelog

### [Version 1.0.0]

- Initial release.
