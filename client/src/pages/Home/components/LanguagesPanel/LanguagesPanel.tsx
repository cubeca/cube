import { Typography } from '@mui/material';
import DoubleLanguagePanel from 'components/DoubleLanguagePanel';
import { useTranslation } from 'react-i18next';


import * as s from './LanguagesPanel.styled';

const LanguagesPanel = () => {
  const { t } = useTranslation('about');

  return (
    <DoubleLanguagePanel
      isReversed={false}
      textContent={
        <s.VRText>
          <div id="language-translation"></div>
          <s.Headline>
          <Typography variant="h1">
            {t('language')}
          </Typography>
          </s.Headline>
          <Typography component="p">
            {t('languageText')}
          </Typography>
          <s.VRTextPP>
          <Typography component="p" variant="body1">
            {t('languageP2')}
          </Typography>
          </s.VRTextPP>
          <s.VRTextPP>
          <Typography component="p" variant="body1">
            {t('languageP3')}
          </Typography>
          </s.VRTextPP>
          <s.LinkWrapper>
            <s.ExternalLinkButton target="_blank" to="https://support.google.com/chrome/answer/173424?hl=en&co=GENIE.Platform%3DDesktop#:~:text=Translate%20webpages%20in%20Chrome&text=Go%20to%20a%20webpage%20written,will%20translate%20your%20current%20webpage.">
              {t('Chrome Translate')}
            </s.ExternalLinkButton>
          </s.LinkWrapper>
        </s.VRText>
      }
      frenchText={
        <s.FRText>
            <s.Headline>
          <Typography variant="h1">
            {t('Langues')}
          </Typography>
          </s.Headline>
        <Typography component="p" variant="body1">
            {t('languageTextFRP1')}
        </Typography>
        <Typography component="p" variant="body1">
            {t('languageTextFRP2')}
        </Typography>
        </s.FRText>
      }
      imageContent={<s.chrome margin="0px 50px 0px 20px"/>}
    />
  );
};

export default LanguagesPanel;
