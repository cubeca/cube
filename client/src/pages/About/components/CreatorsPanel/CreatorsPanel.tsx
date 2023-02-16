import { Box, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AboutPanelRight from '../../../../components/AboutPanelRight/index';
import Button from 'components/Button';

import * as s from './CreatorsPanel.styled';

const CreatorsPanel = () => {
  const { t } = useTranslation('about');
  return (
    <AboutPanelRight
      textContent={
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{backgroundColor: '#95f5cb', padding:'5vw'}}
        >
          <Typography component="h2" variant="h2" textAlign={{sx: 'center', sm: 'center', md: 'right'}} paddingRight={{md: '1rem'}}>
            {t('We Are A Commons')}
          </Typography>
          <Typography component="p" textAlign={{sx: 'center', sm: 'center', md: 'right'}} padding={{xs: '1.5rem', sm: '2rem', md: '1rem'}}>
            {t('creatorsText')}
          </Typography>
          <Box pt="2rem">
            <Button>
              {t('Join US', { ns: 'common' })}
            </Button>
          </Box>
        </Stack>
        
      }

      imageContent={
          <s.Cover>
          </s.Cover>
      }
    />
  );
};

export default CreatorsPanel;
