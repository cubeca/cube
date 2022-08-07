import '@fontsource/arimo';
import ErrorBoundary from 'components/ErrorBoundary';
import 'i18n/config';
import { QueryProvider } from 'providers';
import SnackbarProvider from 'providers/SnackbarProvider';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

if (process.env.REACT_APP_ENABLE_MOCK === 'true') {
  const { worker } = require('mocks'); // eslint-disable-line
  worker.start({ onUnhandledRequest: 'bypass' });
}
const root = ReactDOM.createRoot(document.getElementById('root')!); // eslint-disable-line
root.render(
  <StrictMode>
    <ErrorBoundary>
      <QueryProvider>
        <SnackbarProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SnackbarProvider>
      </QueryProvider>
    </ErrorBoundary>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
