import { styled } from 'theme/utils';
import { Box } from '@mui/system';
import { alpha } from '@mui/material/styles';

export const FormFooter = styled(Box)`
  padding: ${({ theme }) => theme.spacing(2)};
  border-top: 1px solid
    ${(props) => alpha(props.theme.palette.primary.dark, 0.5)};
`;

export const Messages = styled(Box)`
  padding: 1rem 0;
  text-align: center;
`;

export const Actions = styled(Box)`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;

  button {
    margin: 1rem;
  }
`;
