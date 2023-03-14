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
      url: 'https://www.example.com'
    },
    {
      title: t('CAG'),
      description: t('cagDescription'),
      cta: 'Check it out',
      url: 'https://www.example.com'
    },
    {
      title: t('Centrea'),
      description: t('centreaDescription'),
      cta: 'Check it out',
      url: 'https://www.example.com'
    },
    {
      title: t('MOA'),
      description: t('moaDescription'),
      cta: 'Check it out',
      url: 'https://www.example.com'
    },
    {
      title: t('MOV'),
      description: t('movDescription'),
      cta: 'Check it out',
      url: 'https://www.example.com'
    },
    {
      title: t('ARPP APP'),
      description: t('arppDescription'),
      cta: 'Check it out',
      url: 'https://www.example.com'
    },
    {
      title: t('Trinity Square'),
      description: t('trinitySquareDescription'),
      cta: 'Check it out',
      url: 'https://www.example.com'
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
            <s.ExternalLinkText to={card.url}>{card.cta}</s.ExternalLinkText>
          </s.NeighbourCard>
        ))}
      </Grid>
    </Stack>
  );
};

export default DigitalNeighboursPanel;
