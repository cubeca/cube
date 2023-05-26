import { Box, Stack, Divider, Typography, Link as MuiLink } from '@mui/material';
import { styled } from 'theme/utils';

export const VideoWrapper = styled(Box)`
  position: relative;
  width: 100%;
  padding-top: 56.25%;

  & > div,
  video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100% !important;
  }
`;

export const ContentWrapper = styled(Box)`
  padding: 30px 8.333333333333333%;
  
  ${props => props.theme.breakpoints.up("md")} {
    padding: 60px 11.111111111111111%;
  }
`;

export const ContentDate = styled(Typography)`
  margin-top: 1rem;
  margin-bottom: 1.5rem;
`;

export const Sidebar = styled(Stack)`
  padding: 30px 0;
  
  ${props => props.theme.breakpoints.up("md")} {
    padding: 30px;
  }

  .MuiTypography-h5 {
    color: ${(props) => props.theme.palette.primary.main};
  }
`;

export const Seperator = styled(Divider)`
  margin: 24px 0;
  border-color: ${(props) => props.theme.palette.primary.main};
  opacity: 0.3333;
`;

export const Contributor = styled(Stack)`
  
  &:not(:first-child) {
    margin-top: 16px;
  }
`;

export const ContributorThumb = styled(Box)`
  width: 40px;
  margin-right: 8px;

  img {
    display: block;
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 50%;
  }
`;

export const ContributorName = styled(Typography)`
  color: ${(props) => props.theme.palette.primary.light} !important;
  font-weight: 500;

  a {
    color: inherit;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const ContributorSocial = styled(MuiLink)`
  font-size: 0.875rem;
  text-transform: uppercase;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const Tags = styled(Box)`
  margin: 8px -4px 0;
`;