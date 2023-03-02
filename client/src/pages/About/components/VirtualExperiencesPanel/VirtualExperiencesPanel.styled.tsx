import { Box } from '@mui/material';
import { styled } from 'theme/utils';
import VirtualExperiencesHero from 'assets/images/virtualExperiences.jpg';

export const VRCover = styled(Box)`
background: url(${VirtualExperiencesHero});
background-repeat: no-repeat;
background-size: cover;
height: 100%;
display: flex;
background-position: center;
`;

export{}