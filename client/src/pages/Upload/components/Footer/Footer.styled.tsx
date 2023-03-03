import { styled } from 'theme/utils';
import { Box } from '@mui/system';
import { alpha } from '@mui/material/styles';

export const Footer = styled(Box)`
  padding: ${({ theme }) => theme.spacing(1)};
  border-top: 1px solid
    ${(props) => alpha(props.theme.palette.primary.dark, 0.5)};
`;
