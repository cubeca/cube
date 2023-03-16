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

export const UserContentHeader = styled(Stack)``;
