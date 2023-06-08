import { Box, Stack } from '@mui/material';
import { styled } from 'theme/utils';

export const EditProfileImagesWrapper = styled(Stack)`
  position: relative;
  margin-left: -30px;
  margin-right: -30px;
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
  }

  label {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100%);
    height: calc(100%);
    padding: 0;
    border: 0;
    background: rgba(0,0,0,0.5);

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

export const ImageWrapper = styled(Box)`
  position: absolute;
  top: calc(50% - 60px);
  right: 30px;
  width: 120px;
  height: 120px;
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
    background: rgba(0,0,0,0.5);

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
