import {
  Box,
  Stack,
  Divider,
  Typography,
  Link as MuiLink
} from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from 'theme/utils';

export const VideoWrapper = styled(Box)`
  position: relative;
  width: 100%;
  padding-top: 56.25%;

  & > div,
  video,
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100% !important;
  }
`;
export const LinkWrapper = styled(Box)`
  position: relative;
  width: 100%;
`;
export const AudioWrapper = styled(Box)`
  position: relative;
  width: 100%;
  padding-top: 46.25%;

  & video::-webkit-media-text-track-display {
    overflow: visible !important;
    -webkit-box-sizing: border-box;
    background: black;
    padding: 8px;
  }

  & video::-webkit-media-text-track-container {
    overflow: visible !important;
    -webkit-transform: translateY(-10%) !important;
    transform: translateY(-10%) !important;
    position: relative;
  }

  & > div,
  video,
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100% !important;
  }
`;
export const ContentWrapper = styled(Box)`
  padding: 30px 8.333333333333333%;

  ${(props) => props.theme.breakpoints.up('md')} {
    padding: 60px 11.111111111111111%;
  }
`;

export const Sidebar = styled(Stack)`
  padding: 30px 0;

  ${(props) => props.theme.breakpoints.up('md')} {
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

export const Action = styled(Link)`
  color: ${(props) => props.theme.palette.primary.light} !important;
  font-weight: 500;
  margin-left: 0.5rem;

  a {
    color: inherit;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const ActionsWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const Tags = styled(Box)`
  margin: 8px 0 0;
  max-width: 100%;
  flex-wrap: wrap;
`;

export const Tag = styled(Typography)`
  display: inline;
  word-wrap: break-word;
  white-space: nowrap;
  font-size: 16px;
  color: ${(props) => props.theme.palette.primary.light};
  font-weight: 400;
  font-weight: 400;
  line-height: 21px;
  text-decoration: ${(props) => (props.underline ? 'underline' : 'none')};
`;

export const LoadingWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #1a1919;
`;

export const LoadingText = styled(Typography)`
  color: ${(props) => props.theme.palette.primary.light};
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  padding-top: 0.5rem;

  line-height: 26px;
`;

export const EditSubsButton = styled(MuiLink)`
  color: ${(props) => props.theme.palette.primary.light};
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 26px; /* 162.5% */
  text-decoration-line: underline;
  margin-right: 22px;
`;

export const EditDeleteWrapper = styled(Box)`
  margin-left: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
