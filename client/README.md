# Cube Commons Frontend

This repository is the frontend for the Cube Commons platform which aggregates the video, audio, digital publications and activity booklets by arts organizations and artists across Canada.

The codebase is a standard client-side React Application built from `create-react-app`. It uses Typescript, React Router for page management, Material UI for the component library, and React Query API state management. All API calls are done through the [Cube Commons Back-end for Front End client](https://github.com/cubeca/api-specs). 

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

# Client Architecture

The Cube Commons is a standard client-side React Application created from `create-react-app`. 

The client architecture is organized around 5 domains of responsibility:

1. **API Functions** - handle all calls from to/from the BFF Service (Back-end for Front-End Service). Located in the `/src/api` directory
2. **React Hooks** - stateful logic that supports the behaviour of the React Components, typically handles calls to the API functions using React Query, but can also include other client-side stateful logic. Hooks located in `/hooks` may be reused across the app, but hooks locatetd with Components if specifc to that Component.
3. **Components** - reusable React Components that may be used across the application.
4. **Pages** - pages of the app accessed via that the URL path, configured using React Router. 
5. **Providers** - provide global functionality access to any of the components.

# Styling

The UI is built from the Material UI library. Inline styling using `style` should be avoided if possible. Material UI provides the `sx` prop which can provide styling on the component directly, this should be avoided as well if possible. The hierarchy of styling should be as global as possible unless it is known that a specific style is unique to a component.

1. `/theme/index.ts` - Component styles, colors and fonts should be defined here and referenced from here. This keeps the styles global so simply using a Mui component comes with the styling that is expected. 
2. Styled Components - These are specified with the components in the form of `<component-name>.styled.tsx`. Follows standard css structure, props can be passed in to allow for dynamic styling. Styled Components use named exports, and then within the component using the styled component the form `import * as s from <component-name>.styled.tsx` can be used. Styled components are then designated as `s.TextInput`, `s.Dropdown`, etc so it is clear that the component referenced is just a styled component.
3. Inline Styling - can be used as a last resort if a style is specific to one component only or is a small styling. But, beware of polluting the components with styling and getting lazy.

# Best Practices

1. Practice DRY (Don't Repeat Yourself) coding - anything that is reused should be defined in a globally shareable directory. Avoid importing things defined within one component and exporting into another component. Directory structure is defined below.

2. Keep Styling as global as possible and avoid individual styles. Use CSS Best practices, avoid using `!important`. Usage of styled components should generally avoid the kinds of conflicts that are created when using global CSS. See styling section above.

3. Do not directly call the backend or third party libraries from within components. There should be an API function for every backend end point, and all calls should be done from within hooks.

4. All significant business/state logic should be encapsulated within hooks.

5. Put all new form components within the `/client/src/components/form` directory. Follow the established patterns using React Hook Forms  and the MUI `FormControl` for error handling. Input components should be able to be dropped anywhere in the application with expected styling/error handling and no further config/styling required beyond exposed props.

6. No Magic strings or numbers (e.g. `const a = someVar === 3 ? 'abc' : 'def'`). All human readable strings should be defined as keys using react-i18next (`t('translationKey')`). Other constants should be either defined globally within the file used, or defined as a global constant. This includes things like local storage keys or cookie keys.

7. As much as possible, use correct Typescript types. Avoid using `any` if at all possible. 

# Directory Structure

## public

- Core files for deploying the app and attaching the react app to the `index.html`.

NOTE: [runtime-env-cra](https://www.npmjs.com/package/runtime-env-cra) is used to provide BFF urls to the client. This script injects specified server-side env variables into the client at build, so they are accessible to the client at runtime. The file `runtime-env.js` specifies which env variables will be injected.

## src

Key Files:

- index.tsx: Sets up global providers used across the entire app
- App.tsx: Sets up UI related providers

### api

- Exports all api related functions used across the app. Functions are wrappers for the BFF api. All config for the the BFF is defined in index.ts.

### assets

- Image files, icons, etc used in components.

### components

- Global components shared across the app. Some notable directories include:
  - `form`: All form related input fields go here. All form inputs in the app **should** use a component from this directory.
  - `layout`: All components related to the overall layout of the app.

### constants

- Global constants. There should not be any "magic strings" or "magic numbers" in the app. Constants can be defined within the file/component they are being used, but if they are occuring across the app, should be defined here.

### hooks

- Global hooks that are used within components for behavioural logic. In general, all state management, except the most basic internal to a component's UI should be in a hook. Hooks in general will call the BFF API within the hook, and return the state to the calling component. Hooks can also contain reusable client-side logic.

### i18n

- Internationalization files. Configured via `config.ts`. The actual translation files are contained in the corresponding language directory.

NOTE: There is not currently set pattern for doing translations within the app as of time of this writing (Dec 2023). A pattern should be defined and followed for the translation keys, as well as the file format (whether separated into files by categories, or one single file). If one single file is used (e.g. `en.json`), then subdirectories are not necessary.

Translations are used within the app as follows:

```
import { useTranslation } from 'react-i18next';

const SomeComponent = () => {
      const { t } = useTranslation();

      return (
        <h1>{t('translationKey')}</h1>
      )
}
```

For more documentation on using react-i18next, [see documentation](https://react.i18next.com/).

### pages

- Root pages for the app. Correspond to a path in the URL. All paths are defined in the root directory (`/client/src/Router.tsx`) which map to one of the components in this directory
- These directories can be structured in whatever way makes most logical sense. There can be components/hooks/styles that are specfic to this page, global component/hooks/styles can be imported. Basically, any logic or components related only to this page and it's layout can be defined within the pages directory, otherwise in the global directories.

### providers

- Custom providers the provide global data to the app. Key ones are:
  - QueryProvider: Provides the Query Client to the app for ReactQuery. Will be used by hooks within the app.
  - SnackbarProvider: Provides the snackbar to the app for handling notification messages and error message to the user
  - UserProvider: Provides the functionality for setting the userData after login, and accesing the user data across the app as needed.

### theme

- MUI Theme related config

### types

- Global typescript types if needed.

### utils

- Global utils that can be used anywhere in the app. Typically non hook related business logic, access to third-party libraries unrelated to the api, mapping, etc.

# Key Libraries

- [React Query](https://tanstack.com/query/v3/)
- [React Router](https://reactrouter.com/en/main)
- [Material UI](https://mui.com/material-ui/)
- [React Hook Form](https://react-hook-form.com/)
- [React i18next](https://react.i18next.com/)
