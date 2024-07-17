import { styled } from 'theme/utils';
import { Box, Stack, Typography } from '@mui/material';

export const FormTypography = styled(Stack)`
  label,
  .MuiFormLabel-root,
  .MuiInputBase-formControl {
    margin: 0 !important;
  }
`;

export const ModalContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 0 24px;
`;

export const ModalContent = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  padding: 24px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows[4]};
  text-align: center;
`;

export const ModalTitle = styled(Typography)`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;
export const ModalDescription = styled(Typography)`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

export const ProgressBarContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(5)};
`;

export const ProgressBar = styled(Box)<{ progress: number }>`
  min-width: 50vw;
  max-width: 500px;
  height: 16px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-radius: 4px;

  &::after {
    content: '';
    display: block;
    width: ${({ progress }) => progress}%;
    height: 100%;
    background-color: ${({ theme }) => theme.palette.primary.main};
    border-radius: 4px;
  }
`;
