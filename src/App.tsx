import Main from './components/layout/Main';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import getTheme from './theme';
import Router from 'Router';

const App = () => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <ThemeProvider theme={getTheme()}>
      <CssBaseline />
      <Main>
        {'Hello'}
        <Router />
      </Main>
    </ThemeProvider>
  </LocalizationProvider>
);
export default App;
