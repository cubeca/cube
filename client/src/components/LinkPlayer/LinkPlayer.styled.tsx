import { Box, Stack } from '@mui/material';
import { styled } from 'theme/utils';

export const Container = styled(Box)`
  width: 100%;
  height: auto;
`;

export const SubContainer = styled(Box)`
  display: flex;
  flex-direction: column;
`;

export const ImageBox = styled(Box)`
  width: 100%;

  background: no-repeat center/cover;
`;

export const UrlInfoBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.palette.background.paper};
  padding: 30px;
`;

export const LeftContainer = styled(Box)`
  display: flex;
`;
