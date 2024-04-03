import { Box, Stack } from '@mui/material';
import { styled } from 'theme/utils';
import { Link as RouterLink } from 'react-router-dom';
import VirtualExperiencesHero from 'assets/images/virtualExperiences.jpg';
import Chrome from '../../../../assets/images/chrome.png'

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
  padding: 4px 8.333333333333333%;
  background-color: #95f5cb;
  display: flex;
  flex-flow: column nowrap; 
  justify-content: center;

  ${(props) => props.theme.breakpoints.up('md')} {
    padding: 4px 16.666666666666666%;
  }

  * {
    color: #28343C;
  }
  p {
    margin-bottom: 0;
  }
`;
export const VRTextPP = styled(Stack)`
p {
    margin-top: 20px
}
`;

export const FRText = styled(Stack)`
padding: 8px 9.333333333333333%;
`;

export const Headline = styled(Box)`
  padding: 20vw 0 8.333333333333334vw 0;
  
  ${(props) => props.theme.breakpoints.up('md')} {
    padding: 4.333333333333334vw 0 2.333333333333334vw;
  }

  h1 {
    font-weight: 400;
    margin: 0;

    .category {
      color: ${(props) => props.theme.palette.primary.main};
      font-weight: 600;
    }
  }

  h2 {
    margin: 16px 0;
  }
`;

export const chrome = styled(Box)`
  background: url(${Chrome});
  max-width: 90%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  display: flex;
  max-height: 100%;
  min-height: 20vw;
  

  ${(props) => props.theme.breakpoints.up('md')} {
    min-height: 10vw;
  }
`;

export const LinkWrapper = styled(Box)`
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  gap: 8px;
  padding: 9.3vw 0rem 10vw;
  
  ${(props) => props.theme.breakpoints.up('md')} {
    flex-flow: row wrap;
    gap: 24px;
    padding: 3rem 0 4.333333333333334vw;
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

  &:hover {
    background-color: ${(props) => props.theme.palette.primary.light};
    color: ${(props) => props.theme.palette.primary.contrastText} !important;
  }
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
