import { styled } from 'theme/utils';
import { Box } from '@mui/material';
import Button from 'components/Button';

export const FullscreenModalContainer = styled(Box)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${(props) => props.theme.palette.background.default};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

export const ModalPageContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  marginbottom: 20px;
`;

export const ModalButton = styled(Button)`
  margin: 20px;
`;
