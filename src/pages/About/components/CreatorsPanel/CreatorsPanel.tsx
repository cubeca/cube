import { Box, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AboutPanel from '../AboutPanel';
import CreatorsHero from 'assets/images/creators.jpg';
import Button from 'components/Button';

import * as s from './CreatorsPanel.styled';

const CreatorsPanel = () => {
  const { t } = useTranslation('about');
  return (
    <AboutPanel
      textContent={
        <Stack
          px="2rem"
          alignItems="center"
          justifyContent="center"
          sx={{ textAlign: 'right', backgroundColor: '#95f5cb', p: '5rem'}}
        >
          <Typography component="h2" variant="h2">
            {t('We Are A Commons')}
          </Typography>
          <Typography component="p" sx={{ paddingBottom: '1.5rem' }}>
            {t('creatorsText')}
          </Typography>
          <Box py="2rem">
            <Button>
              {t('Join US', { ns: 'common' })}
            </Button>
          </Box>
        </Stack>
        
      }
    // //I am not sure this image is covering and  what the best method of the below
      imageContent={
        <Box sx={{height: '100%'}}>
          <img src={CreatorsHero} alt="" height="100%" width="100%" object-fit= "cover"/>
        </Box>
          // <s.Cover>
          // </s.Cover>
          // // <Box sx={{
          // //   display: 'flex',
          // //   backgroundImage: `url('${CreatorsHero}')`,
          // //   backgroundRepeat: 'no-repeat',
          // //   backgroundSize: 'cover'
          // // }}
          // // p="20px"
          // // justifyContent="center">
          // // </Box>
      }
    />
  );
};

export default CreatorsPanel;
