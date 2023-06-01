import { Box, Stack } from '@mui/material';
import { styled } from 'theme/utils';

export const UserProfile = styled(Box)``;

export const UserHeroBg = styled(Box)`
  position: relative;
  width: 100%;
  height: 360px;

  img {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 87.5%;
    height: 100%;
    object-fit: cover;
  }

  &::after {
    content: '';
    display: block;
    position: absolute;
    z-index: 2;
    top: 0;
    right: 0;
    width: 25%;
    height: 100%;
    background-image: linear-gradient(
      90deg,
      rgba(40, 52, 60, 0) 0%,
      rgba(40, 52, 60, 0.666) 25%,
      rgba(40, 52, 60, 1) 50%
    );
  }
`;

export const UserContentHeader = styled(Stack)`
  padding-top: 60px;

  h3 {
    ${(props) => props.theme.breakpoints.up('md')} {
      font-size: 2.5rem;
    }
  }
`;

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
  flex: 0 0 360px;
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

export const EditProfileHeroBg = styled(Box)`
  position: relative;
  width: 100%;
  height: 200px;

  img {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

export const Body = styled(Box)`
  padding: 60px 30px;
`;
