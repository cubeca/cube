import { Box } from '@mui/system';
import { styled } from 'theme/utils';

export const ImageWrapper = styled(Box)`
  position: relative;
  width: 32px;
  height: 32px;
  margin-bottom: 16px;
`;

export const ImageInner = styled('div')`
  display: block;
  position: relative;
  width: 32px;
  height: 32px;
  border: 2px solid ${(props) => props.theme.palette.primary.dark};
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
