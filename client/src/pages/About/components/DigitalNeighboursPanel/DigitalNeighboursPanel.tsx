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
      description: t('Learn about Praxis a new platform for publishing and connecting shared knowledge production'),
      cta: 'Check it out',
      url: 'https://praxis.encommun.io/'
    },
    {
      title: t('221A'),
      description: t('Digital Strategy funded research on Blockchains & Cultural Padlocks'),
      cta: 'Check it out',
      url: 'https://221a.ca/221a-launches-bacp-research-report/'
    },
    {
      title: t('Livepeer'),
      description: t('An open video infrastructure protocol for designed to give developers the freedom to innovate and creators autonomy from platforms.'),
      cta: 'Check it out',
      url: 'https://livepeer.org/'
    },
    {
      title: t('Mobil Art School'),
      description: t('Try their Arpp App that helps artists create-collaborate-celebrate in the digital space'),
      cta: 'Check it out',
      url: 'https://apps.apple.com/ca/app/arpp/id1498008023'
    },
    {
      title: t('Missing Black Technofossils Here'),
      description: t('Quentin VerCettys self-guided AR experience with PHI Foundation'),
      cta: 'Check it out',
      url: 'https://phi.ca/en/events/quentin-vercetty-self-guided-visit/'
    },
    {
      title: t('...'),
      description: t('More Coming'),
      cta: '',
      url: ''
    }
  ];

  return (
    <Stack
      textAlign="center"
      alignItems="center"
      p="0 8.333333333333333% 120px"
    >
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
    </Stack>
  );
};

export default DigitalNeighboursPanel;
