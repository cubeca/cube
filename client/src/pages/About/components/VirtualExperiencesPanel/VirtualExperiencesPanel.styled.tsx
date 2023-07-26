import { Box, Stack } from '@mui/material';
import { styled } from 'theme/utils';
import { Link as RouterLink } from 'react-router-dom';
import VirtualExperiencesHero from 'assets/images/virtualExperiences.jpg';

export const VRCover = styled(Box)`
  background: url(${VirtualExperiencesHero});
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
  min-height: 100vw;
  display: flex;
  background-position: center;

  ${(props) => props.theme.breakpoints.up('md')} {
    min-height: 50vw;
  }
`;

export const VRText = styled(Stack)`
  height: 100%;
  padding: 24px 8.333333333333333%;
  background-color: #95f5cb;
  display: flex;
  flex-flow: column nowrap; 
  justify-content: center;

  ${(props) => props.theme.breakpoints.up('md')} {
    padding: 120px 16.666666666666666%;
  }

  * {
    color: #28343C;
  }
`;

export const LinkWrapper = styled(Box)`
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  gap: 8px;
  padding: 0 0 1.5rem 0;
  
  ${(props) => props.theme.breakpoints.up('md')} {
    flex-flow: row wrap;
    gap: 24px;
    padding: 1.5rem 0;
  }
`;

export const ExternalLinkButton = styled(RouterLink)`
  width: auto;
  font-size: inherit;
  font-weight: 700;
  text-decoration: inherit;
  line-height: inherit;
  background-color: ${(props) => props.theme.palette.background.default};
  color: ${(props) => props.theme.palette.primary.main} !important;
  padding: 1rem 2rem;
  border-radius: 5px;
`;

export const ExternalLinkText = styled(RouterLink)`
  font-size: inherit;
  font-weight: 700;
  color: inherit;
  text-decoration: underline;
  line-height: inherit;
  padding: 1rem 2rem 1rem 0;
  border-radius: 5px;
`;
