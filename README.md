# CUBE Frontend

## Auto-deployed preview of the latest commit

You can preview the latest commit at https://frontend-tjjg4pjowa-pd.a.run.app/ after the deploy Github Action has finished running, which can be monitored here: https://github.com/cubeca/cube_ui/actions

## How to run this as a Docker container

1. Gain access to the CUBE private NPM packages. Pick one of these 2 methods, both work for building the Docker image:
  - via [private NPM package registry](https://www.notion.so/How-to-get-private-NPM-packages-from-GPR-Github-Packages-Registry-at-npm-pkg-github-com-fb4982cd852c405ba1350b4a748ef0a0)
  - use [`npm link` for local Frontend development](https://www.notion.so/How-to-use-npm-link-for-local-Frontend-development-7e5a42b1b0cc42cbb751e36d78bb679f) (i.e. development of both frontend AND api-spec in parallel)
1. Run `make docker_build`
1. Run `REACT_APP_API_URL=https://bff-mock-server-tjjg4pjowa-pd.a.run.app/ make docker_run`

Of course you can set the `REACT_APP_API_URL` environment variable to wherever else you might have the API (or it's mock server) running.

https://bff-mock-server-tjjg4pjowa-pd.a.run.app/ is a mock server which gets auto-deployed by the latest commit in https://github.com/cubeca/api-specs

### Caveat

The Docker image starts really slow because it is still running the React dev server, until we've sorted out some issues with building this into a static app.

### Docker environment variables:

- `REACT_APP_API_URL`: The URL of the API instance you want the frontend to use
- `PORT`: The port to serve the frontend from, defaults to 3000


---

FTR [React README](./README-React.md)
