import { Box } from '@mui/material';
import { styled } from 'theme/utils';
import CreatorsHero from 'assets/images/creators.jpg';

export const Cover = styled(Box)`
background: url(${CreatorsHero});
background-repeat: no-repeat;
background-size: cover;
height: 100%;
display: flex;
background-position: center;
`;