import { Stack, Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import { useTranslation } from 'react-i18next';

import * as s from './DigitalNeighboursPanel.styled';

const DigitalNeighboursPanel = () => {
  const { t } = useTranslation('about');

  const cards = [
    {
      title: t('Artengine'),
      description: t('artengineDescription'),
      cta: 'Check it out',
      url: 'https://artengine.ca/hyperlib_proto/'
    },
    {
      title: t('Projet Collectif'),
      description: t('projetCollectifDescription'),
      cta: 'Check it out',
      url: 'https://praxis.encommun.io/'
    },
    {
      title: t('221A'),
      description: t('221aDescription'),
      cta: 'Check it out',
      url: 'https://221a.ca/221a-launches-bacp-research-report/'
    },
    {
      title: t('Mobil Art School'),
      description: t('mobileArtSchoolDescription'),
      cta: 'Check it out',
      url: 'https://apps.apple.com/ca/app/arpp/id1498008023'
    },
    {
      title: t('Missing Black Technofossils Here'),
      description: t('mbtfDescription'),
      cta: 'Check it out',
      url: 'https://phi.ca/en/events/quentin-vercetty-self-guided-visit/'
    },
    {
      title: t('Plug In ICA'),
      description: t('magicGlitterDescription'),
      cta: 'Check it out',
      url: 'https://plugin.org/exhibitions/magic-keystrokes-and-glitter-with-dr-syrus-marcus-ware-and-kamran-behrouz/'
    },
    {
      title: t('Metalabel'),
      description: t('metaLabelDescription'),
      cta: 'Check it out',
      url: 'https://www.metalabel.xyz/'
    }
  ];

  return (
    <s.DigitalNeighboursPanel>
      <Typography component="h2" variant="h2">
        {t('Our Digital Community')}
      </Typography>
      <Typography
        component="p"
        sx={{
          textAlign: 'center',
          maxWidth: '720px',
          margin: '0 auto'
        }}
      >
        {t('digitalNeighboursText')}
      </Typography>

      <Grid container mt={8}>
        {cards.map((card, index) => (
          <s.NeighbourCard key={card.title}>
            <Typography component="h6" variant="h6">
              {card.title}
            </Typography>
            <Typography component="p" variant="body2">
              {card.description}
            </Typography>
            <s.ExternalLinkText target="_blank" to={card.url}>{card.cta}</s.ExternalLinkText>
          </s.NeighbourCard>
        ))}
      </Grid>
    </s.DigitalNeighboursPanel>
  );
};

export default DigitalNeighboursPanel;
