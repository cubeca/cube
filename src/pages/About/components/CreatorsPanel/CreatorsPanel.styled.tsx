import { List } from '@mui/material';
import { styled } from 'theme/utils';
import CreatorsHero from 'assets/images/creators.jpg';

export const Cover = styled(List)`
background: url(${CreatorsHero});
background-repeat: no-repeat;
background-size: cover;
width: calc(100% + 1000px);
`;