import { Box, Dialog, Link, Stack, TextField, Typography } from '@mui/material';
import { styled } from 'theme/utils';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
export const UserProfile = styled(Box)``;

export const DeletePlaylistContainer = styled(Box)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  padding: 10px 0;
`;

export const DeletePlaylistText = styled(Typography)`
  color: #d9ffee;
  font-size: 18px !important;
  font-style: normal;
  font-weight: 400;
  line-height: 26px !important; /* 144.444% */
  letter-spacing: 0.234px;
  padding-bottom: 10px;
  text-decoration: underline;
  margin-bottom: 0;
  cursor: pointer;
`;

export const CustomDialog = styled(Dialog)(({ theme }) => ({
  marginBottom: '24px',
  '& .MuiDialog-paper': {
    backgroundColor: '#95f5cb',
    color: 'black',
    paddingTop: '12px',
    paddingBottom: '24px',
    paddingLeft: '12px',
    paddingRight: '12px'
  }
}));

export const StyledRemoveIcon = styled(RemoveIcon)({
  zIndex: 100,
  position: 'absolute',
  width: '22px',
  height: '22px',
  left: '-40px',
  borderRadius: '4px',
  color: 'black;',
  backgroundColor: '#95f5cb',
  backdropFilter: 'blur(4px) brightness(0.5)',
  border: '1px solid #ddd',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05) ',
    backgroundColor: '#d9ffee'
  }
});

export const StyledCloseIcon = styled(CloseIcon)({
  zIndex: 100,
  position: 'absolute',
  width: '22px',
  height: '22px',
  left: '-40px',
  padding: '2px',
  borderRadius: '4px',
  color: '#95f5cb',
  border: '1px solid #95f5cb',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05) '
  }
});

export const RelativeBox = styled(Box)`
  position: relative;
`;

export const TextFieldContainer = styled(Box)`
  position: relative;
  width: 100%;
`;

export const IconContainer = styled(Box)`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 10px;
`;

export const PlaylistItemLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

export const PlaylistTitleContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 10px;
`;

export const PlaylistTitleSubContainer = styled(Box)`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

export const PlaylistTitle = styled(Typography)`
  color: #95f5cb;

  font-family: Rubik;
  font-size: 24px !important;
  font-style: normal;
  font-weight: 400;
  line-height: 40px; /* 166.667% */
  padding: 0 !important;

  margin-bottom: 0;
`;

export const PlaylistTitleInput = styled(TextField)`
  color: #95f5cb;

  font-family: Rubik;
  font-size: 24px !important;
  font-style: normal;
  font-weight: 400;
  line-height: 40px; /* 166.667% */
  margin-left: 0;
  margin-bottom: 0;
`;
export const PlaylistDescriptionContainer = styled(Box)`
  padding-bottom: 15px;
  border-bottom: 1px solid #57838b;
`;

export const PlaylistDescription = styled(Typography)`
  color: #d9ffee;
  font-size: 18px !important;
  font-style: normal;
  font-weight: 400;
  line-height: 26px !important; /* 144.444% */
  letter-spacing: 0.234px;
  padding-bottom: 10px;

  margin-bottom: 0;
`;

export const PlaylistItemTitle = styled(Typography)`
  color: #d9ffee;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 21px; /* 131.25% */
  padding: 15px 0;
  margin: 0;
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

export const PlaylistItemThumbnail = styled(Box)<{ bgUrl: string }>`
  display: flex;
  width: 30px;
  height: 30px;
  margin-right: 10px;
  background: url(${(props) => props.bgUrl});
  background-size: contain;
`;

export const UserContentHeader = styled(Stack)`
  padding-top: 60px;

  h3 {
    ${(props) => props.theme.breakpoints.up('md')} {
      font-size: 2.5rem;
    }
  }
`;

export const EditWrapper = styled(Box)`
  position: relative;
  display: flex;
  gap: 10px;
  margin-left: 10px;
  button,
  label {
    display: block;
    width: 28px;
    height: 28px;
    padding: 0;
    border: 0;
    border-radius: 14px;
    background: ${(props) => props.theme.palette.primary.main};
    transition: transform 0.3s ease-in-out;

    &:hover {
      transform: scale(1.1);
    }

    svg {
      position: absolute;
      top: 4px;
      left: 4px;
      width: 20px;
      height: 20px;

      path {
        fill: ${(props) => props.theme.palette.background.default};
      }
    }
  }
`;

export const PlaylistStack = styled(Stack)`
  margin-bottom: 64px !important;
  margin-top: 100px;
  gap: 40px;
  display: flex;
  flex-flow: column nowrap;

  ${(props) => props.theme.breakpoints.up('md')} {
    margin-bottom: 64px !important;
    gap: 40px !important;
  }

  > form {
    width: 100%;
    display: flex;
    flex-flow: column nowrap;

    ${(props) => props.theme.breakpoints.up('md')} {
      margin-bottom: 16px !important;
      gap: 40px;
    }
  }

  .editInput {
    margin-bottom: 0 !important;
    margin-top: 0 !important;
    padding-bottom: 0 !important;
    padding-top: 0 !important;
    width: 100%;

    > .MuiBox-root > * {
      margin-bottom: 0 !important;
      margin-top: 0 !important;
      padding-bottom: 0 !important;
      padding-top: 0 !important;
    }
  }
  .MuiInputBase-root.MuiInput-root {
    margin-bottom: 0 !important;
    margin-top: 0 !important;
    padding-bottom: 0 !important;
    padding-top: 0 !important;
  }

  .MuiInputBase-input.MuiInput-input {
    padding: 3px 1px;
  }

  .MuiInputBase-root.MuiOutlinedInput-root {
    padding: 10px;
    margin-bottom: 0;
    font-size: 18px;
  }

  .searchFilter {
    margin-top: 40px;
    width: 100%;

    > .MuiBox-root > * {
      display: none;
    }

    .MuiInputBase-root {
      width: 100%;

      input {
        width: 100%;
      }
    }

    > .MuiBox-root > *.MuiFormControl-root,
    > .MuiBox-root > *.MuiFormControl-root .MuiFormControl-root {
      display: block !important;
      padding: 0 !important;
      margin: 0 !important;

      .MuiInput-underline {
        &:before {
          border-bottom: 1px solid
            ${(props) => props.theme.palette.primary.main};
        }

        input {
          padding: 8px 0;
          font-size: 24px;
          color: ${(props) => props.theme.palette.primary.main};

          ${(props) => props.theme.breakpoints.up('md')} {
            font-size: 32px;
          }

          &::placeholder {
            opacity: 1;
          }
        }
      }
    }
  }

  .typeFilter {
    .MuiInputBase-root,
    .MuiFormLabel-root {
      margin-bottom: 0 !important;
    }
  }
`;
