import { Box, Stack } from '@mui/material';
import { styled } from 'theme/utils';

export const Subscribe = styled(Stack)`
  display: flex;
  flex-flow: column nowrap;
  gap: 20px;
`;

export const InlineFormWrapper = styled(Stack)`
  margin: 8px 0;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: stretch;
  gap: 1rem;

  > * {
    margin: 0;
  }

  .MuiBox-root,
  .MuiInputBase-root,
  .MuiFormHelperText-root {
    margin: 0 !important;
  }

  .MuiButtonBase-root {
    flex: 0 0 auto;
    width: auto;
  }
`;