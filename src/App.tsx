import Main from './components/layout/Main';
import { CssBaseline, ThemeProvider } from '@mui/material';

import getTheme from './theme';
import Router from 'Router';

const App = () => (
  <ThemeProvider theme={getTheme()}>
    <CssBaseline />
    <Main>
      <Router />
    </Main>
    ;
  </ThemeProvider>
);
export default App;
