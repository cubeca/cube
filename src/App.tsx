import Main from './components/layout/Main';
import { CssBaseline, ThemeProvider } from '@mui/material';

import getTheme from './theme';

const App = () => (
    <ThemeProvider theme={getTheme()}>
        <CssBaseline />
        <Main>I am the content</Main>;
    </ThemeProvider>
);
export default App;
