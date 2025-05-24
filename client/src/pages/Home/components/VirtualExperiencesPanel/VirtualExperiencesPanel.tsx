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
          <div id="virtual-experiences"></div>
          <s.Headline>
          <Typography variant="h1">
            {t('virtual')}
          </Typography>
          <Typography component="h3" variant="h3" lang="fr">
            {t('virtualFR')}
          </Typography>
          </s.Headline>
          <Typography component="p">
            {t('virtualText')}
          </Typography>
          <Typography component="p" variant="body2" lang="fr">
            {t('virtualTextFR')}
          </Typography>
          <s.LinkWrapper>
            <s.ExternalLinkButton target="_blank" to="https://www.voxels.com/">
              {t('Voxels')}
            </s.ExternalLinkButton>
            <s.ExternalLinkText
              target="_blank"
              to="https://wiki.cryptovoxels.com/"
            >
              {t('Voxels Guide')}
            </s.ExternalLinkText>
          </s.LinkWrapper>
        </s.VRText>
      }
    />
  );
};

export default VirtualExperiencesPanel;
