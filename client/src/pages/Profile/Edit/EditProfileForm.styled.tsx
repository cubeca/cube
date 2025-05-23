import { Box, Stack } from '@mui/material';
import { styled } from 'theme/utils';

export const EditProfileImagesWrapper = styled(Stack)`
  position: relative;
  margin-left: -20px;
  margin-right: -20px;
  margin-bottom: 30px;
  tabindex: "0"

  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-left: -24px;
    margin-right: -24px;
  }
`;

export const UploadButton = styled('button')`
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    border: 0;
    background: rgba(0, 0, 0, 0.5);
    cursor: pointer;
    z-index: 1;
    outline: none;

    &:focus {
      box-shadow: 0 0 0 3px ${(props) => props.theme.palette.primary.main};
    }

    p {
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      margin: 8px auto 0;
      text-align: center;
      color: ${(props) => props.theme.palette.primary.light};
      font-size: 0.75rem;
      font-weight: 500;
    }

    svg {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -14px;
      margin-top: -21px;

      circle,
      path {
        fill: ${(props) => props.theme.palette.primary.light};
      }
    }
`;
export const EditProfileHeroBg = styled(Box)`
  position: relative;
  width: 100%;
  height: 160px;

  img {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
  }
  `;
  
export const ImageWrapper = styled(Box)`
  position: absolute;
  top: calc(50% - 60px);
  right: 30px;
  width: 120px;
  height: 120px;
  z-index: 2;
`;

export const ImageInner = styled('a')`
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  border: 4px solid ${(props) => props.theme.palette.primary.main};
  border-radius: 80px;
  text-decoration: none;
  overflow: hidden;

  img {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const EditWrapper = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  label {
    display: block;
    position: absolute;
    top: 4px;
    left: 4px;
    width: calc(100% - 8px);
    height: calc(100% - 8px);
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.5);

    p {
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      margin: 8px auto 0;
      text-align: center;
      color: ${(props) => props.theme.palette.primary.light};
      font-size: 0.75rem;
      font-weight: 500;
    }

    svg {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -14px;
      margin-top: -21px;

      circle,
      path {
        fill: ${(props) => props.theme.palette.primary.light};
      }
    }
  }
`;

export const EditFieldsWrapper = styled(Box)`
  label {
    color: ${(props) => props.theme.palette.background.default};
  }
`;
