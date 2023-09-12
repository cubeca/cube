import { Button as MuiButton, ButtonProps } from '@mui/material';
import { styled } from 'theme/utils';

export const Button = styled(MuiButton)`
  font-size: 1rem; 
  margin-top: 1rem;

  &.MuiButton-containedPrimary {
    box-shadow: none !important;

    &:hover {
      background: ${({ theme }) => theme.palette.primary.light} !important;
      color: ${({ theme }) => theme.palette.primary.contrastText} !important;
    }
  }

  &.MuiButton-containedSecondary {
    box-shadow: none !important;
    color: ${({ theme }) => theme.palette.primary.main} !important;

    &:hover {
      background: ${({ theme }) => theme.palette.primary.light} !important;
      color: ${({ theme }) => theme.palette.primary.contrastText} !important;
    }
  }
`;