import { styled } from 'theme/utils';
import { Box,  Select as MuiSelect } from '@mui/material';

export const Select = styled(Box)`
  
  .MuiOutlinedInput-notchedOutline {
    border-color: ${(props) =>
      props.theme.palette.primary.main} !important;
  }
`;