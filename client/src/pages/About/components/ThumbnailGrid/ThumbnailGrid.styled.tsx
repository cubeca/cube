import { styled } from 'theme/utils';
import { Box } from '@mui/material';

export const ThumbnailGridWrapper = styled(Box)`
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: ${(props) =>
    props.alignment == 'bottom' ? 'flex-end' : 'flex-start'};
  padding-bottom: 120px;
`;

export const ThumbTransparent = styled(Box)`
  padding-bottom: 100%;
  background-color: transparent;
`;
export const ThumbLight = styled(Box)`
  padding-bottom: 100%;
  background-color: ${({ theme }) => theme.palette.primary.light};
`;
export const ThumbDark = styled(Box)`
  padding-bottom: 100%;
  background-color: ${({ theme }) => theme.palette.primary.dark};
`;
export const ThumbImg = styled(Box)`
  position: relative;
  padding-bottom: 100%;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
