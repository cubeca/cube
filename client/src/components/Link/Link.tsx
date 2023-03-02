import { Link as RouterLink } from 'react-router-dom';
import { ReactNode } from 'react';
import { useTheme } from '@mui/system';

interface Props {
  to: string;
  children: ReactNode;
}

const Button = ({ to, children }: Props) => {
  const theme = useTheme();
  return (
    <RouterLink to={to} style={{ color: theme.palette.primary.main }}>
      {children}
    </RouterLink>
  );
};
export default Button;
