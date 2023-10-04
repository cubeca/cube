# Cube Commons Frontend

This repository is the frontend for the Cube Commosn platform which aggregates the video, audio, digital publications and activity booklets by arts organizations and artists across Canada.

## Configuration

1. In the `.env` file, you must specify a `PORT` for the application to run on and the `REACT_APP_BFF_URL` which is the backend service providing the data.  You can check an example configuration in `.env.example`.

## Building

1. `npm i`
2. `npm run build`

## Deployment to Cloudflare Pages
Cube Commons hosts the frontend using Cloudflare Pages in a serverless context.

- Commits to `main` are automatically deployed and viewable at: `https://www-main.cubecommons.ca/`
- Commits to `deploy-dev` are automatically deployed and viewable at: `https://www-dev.cubecommons.ca/`
- Commits to `deploy-production` are automatically deployed and viewable at: `https://cubecommons.ca/`

Currently Cloudflare is configured to support only `main` and `deploy-dev` branches for development but can be extended to support any branch created in the repository.