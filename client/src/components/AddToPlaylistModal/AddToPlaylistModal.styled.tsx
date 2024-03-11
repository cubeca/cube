import { styled } from 'theme/utils';
import Button from 'components/Button';
import { Box, IconButton, TextField, Typography } from '@mui/material';

export const ModalContainer = styled(Box)`
  width: 100%;
  max-width: 600px;
  padding: 0 20px;
  border-radius: 10px;
  overflow: auto;
  height: 100%;
`;

export const ModalButton = styled(Button)`
  margin: 20px;
`;

export const ButtonContainer = styled(Box)`
  display: flex;
  justify-content: flex-end;
`;
export const PlaylistItemContainer = styled(Box)`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid #57838b;
`;

export const PlaylistItemSubContainer = styled(Box)`
  display: flex;
  align-items: center;
`;
export const PlaylistItemTitle = styled(Typography)`
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 21px; /* 131.25% */
  padding: 15px 0;
  margin: 0;
`;
export const PlaylistItemThumbnail = styled(Box)<{ bgUrl: string }>`
  display: flex;
  width: 30px;
  height: 30px;
  margin-right: 10px;
  background: url(${(props) => props.bgUrl});
  background-size: contain;
`;
export const Close = styled(IconButton)`
  position: absolute;
  right: 8px;
  top: 8px;
  color: ${(props) => props.theme.palette.background.default};
`;

export const ReportContentTextField = styled(TextField)`
  .MuiInputBase-root {
    margin-bottom: 10px;
  }

  & label {
    display: block;
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 0;
    font-weight: 600;
  }

  &.dark {
    & input,
    & fieldset,
    & input:focus + fieldset,
    & input:active + fieldset,
    & input:hover + fieldset {
      border-color: ${(props) =>
        props.theme.palette.background.default} !important;
    }

    & input,
    & textarea {
      color: ${(props) => props.theme.palette.background.default};
    }

    & label {
      color: ${(props) => props.theme.palette.background.default};
    }
  }
`;
