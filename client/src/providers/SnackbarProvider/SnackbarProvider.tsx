import { SnackbarProvider as SBProvider } from 'notistack';
import { FC, ReactNode } from 'react';
import { SnackbarUtilsConfigurator } from './SnackbarConfig';

const defaultAutoHideDuration = 6000;
const maxSnackSize = 3;

const SnackbarProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SBProvider
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      autoHideDuration={defaultAutoHideDuration}
      maxSnack={maxSnackSize}
    >
      <SnackbarUtilsConfigurator />
      {children}
    </SBProvider>
  );
};

export default SnackbarProvider;
