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

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
