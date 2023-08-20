import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AboutPanel from '../../../../components/AboutPanel';

import * as s from './VirtualExperiencesPanel.styled';

const VirtualExperiencesPanel = () => {
  const { t } = useTranslation('about');

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
            <s.ExternalLinkText to="https://wiki.cryptovoxels.com/">
              {t('How to Use Voxels')}
            </s.ExternalLinkText>
          </s.LinkWrapper>
        </s.VRText>
      }
    />
  );
};

export default VirtualExperiencesPanel;