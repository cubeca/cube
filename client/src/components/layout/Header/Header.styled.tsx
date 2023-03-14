import { Stack, Box } from '@mui/material';
import { styled } from 'theme/utils';
import { Link } from 'react-router-dom';
import CubeLogo from 'assets/icons/cube.svg';
import CubeLogoStacked from 'assets/icons/cube-stacked.svg';

export const Header = styled(Stack)`
  position: relative;
  z-index: 100;
  width: 100%;
  padding: 32px 8.333333333333333% 32px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;

  ul {
    padding: 0;
  }
`;

export const HomeLink = styled(Link)`
  display: block;
  flex: 0 0 129px;
  width: 129px;
  height: 40px;
  background: transparent url(${CubeLogoStacked}) no-repeat center/contain;

  ${(props) => props.theme.breakpoints.up('md')} {
    flex: 0 0 240px;
    width: 240px;
    height: 52px;
    background-image: url(${CubeLogo});
  }
`;
