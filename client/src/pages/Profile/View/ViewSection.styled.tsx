import { Stack } from '@mui/material';
import { Box } from '@mui/system';
import { styled } from 'theme/utils';

export const ViewSection = styled(Stack)`
  position: fixed;
  z-index: 3;
  overflow-y: auto;
  top: 120px;
  right: 0;
  width: 25vw;
  height: calc(100vh - 120px);
  align-items: center;
`;

export const Header = styled(Box)`
  height: 360px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  text-align: center;

  small {
    display: block;
    font-size: 14px;
    margin: 4px 0;
    font-weight: 600;
    color: ${(props) => props.theme.palette.primary.main};
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`;

export const ImageWrapper = styled(Box)`
  position: relative;
  width: 160px;
  height: 160px;
  margin-bottom: 16px;
`;

export const ImageInner = styled('a')`
  display: block;
  position: relative;
  width: 160px;
  height: 160px;
  border: 4px solid ${(props) => props.theme.palette.primary.dark};
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
  top: 8px;
  right: 8px;

  button {
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
      top: calc(50% - 10px);
      left: calc(50% - 10px);
      width: 20px;
      height: 20px;

      path {
        fill: ${(props) => props.theme.palette.background.default};
      }
    }
  }
`;

export const Body = styled(Box)`
  padding: 60px 30px;
`;
