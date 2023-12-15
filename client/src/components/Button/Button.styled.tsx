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

  &.MuiButton-sizeLarge {
    font-size: 1.25rem;
  }
`;

export const DeleteButton = styled(Button)`
  background-color: #ffb7c4;
  font-size: 16px;
  color: #28343c;
  height: 45px;
  width: 110px;
  margin-top: 0px;
  margin-right: 0px;

  &:hover {
    background-color: #ffa3b1;
  }

  &.MuiButton-containedPrimary {
    color: #28343c;
  }

  &.MuiButton-containedSecondary {
    color: #28343c;
  }
`;
