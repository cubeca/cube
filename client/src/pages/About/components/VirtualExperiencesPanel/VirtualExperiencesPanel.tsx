import { Box, Typography, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AboutPanel from '../../../../components/AboutPanel';
import Button from 'components/Button';
import { useNavigate } from 'react-router-dom';

import * as s from './VirtualExperiencesPanel.styled';

const VirtualExperiencesPanel = () => {
  const { t } = useTranslation('about');
  const navigate = useNavigate();

  return (
    <AboutPanel
      isReversed={true}
      imageContent={<s.VRCover />}
      textContent={
        <s.VRText>
          <Typography component="h2" variant="h2">
            {t('virtualExperiences')}
          </Typography>
          <Typography component="p">{t('virtualExperiencesText')}</Typography>

          <s.LinkWrapper>
            <s.ExternalLinkButton to="https://www.voxels.com/">
              {t('Visit Voxels')}
            </s.ExternalLinkButton>
            <s.ExternalLinkText to="https://www.voxels.com/">
              {t('How to Use Voxels')}
            </s.ExternalLinkText>
          </s.LinkWrapper>
        </s.VRText>
      }
    />
  );
};

export default VirtualExperiencesPanel;
