import { Box, Typography, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AboutPanelLeft from '../../../../components/AboutPanelLeft/index';
import Button from 'components/Button';

import * as s from './VirtualExperiencesPanel.styled';

const VirtualExperiencesPanel = () => {
  const { t } = useTranslation('about');
  return (
    <AboutPanelLeft
      imageContent={<s.VRCover />}
      textContent={
        <Stack
          alignItems="enter"
          sx={{
            backgroundColor: '#95f5cb',
            padding: '5vw',
            justifyContent: { xs: 'center', sm: 'center', md: 'left' }
          }}
        >
          <Typography
            component="h2"
            variant="h2"
            color="#28343C"
            textAlign={{ xs: 'center', sm: 'center', md: 'left' }}
            padding={{ xs: '1.5rem', sm: '2rem', md: '1rem' }}
          >
            {t('virtualExperiences')}
          </Typography>
          <Typography
            component="p"
            color="#28343C"
            textAlign={{ xs: 'center', sm: 'center', md: 'left' }}
            padding={{ xs: '1.5rem', sm: '2rem', md: '1rem' }}
            marginBottom="1.25rem"
          >
            {t('virtualExperiencesText')}
          </Typography>

          <Box pt="2rem">
            <a href="https://www.voxels.com/">
              <Button>{t('Visit Voxels')}</Button>
            </a>
          </Box>

          <Typography>
            Drop down Instruction on how to use Voxels - arrow keys etc
          </Typography>
        </Stack>
      }
    />
  );
};

export default VirtualExperiencesPanel;
