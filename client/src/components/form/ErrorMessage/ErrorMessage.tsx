import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';

interface ErrorMessageProps {
  children: string | ReactNode;
}

const ErrorMessage: FC<ErrorMessageProps> = ({ children }) => (
  <Box color="#f44336">{children}</Box>
);

export default ErrorMessage;
