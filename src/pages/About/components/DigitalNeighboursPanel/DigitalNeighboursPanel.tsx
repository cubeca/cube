import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import * as s from './DigitalNeighboursPanel.styled';

const DigitalNeighboursPanel = () => {
  const { t } = useTranslation('about');

  const cards = [
    {
      title: t('Artengine'),
      description: t('artengineDescription')
    },
    {
      title: t('CAG'),
      description: t('cagDescription')
    },
    {
      title: t('Centrea'),
      description: t('centreaDescription')
    },
    {
      title: t('MOA'),
      description: t('moaDescription')
    },
    {
      title: t('MOV'),
      description: t('movDescription')
    },
    {
      title: t('ARPP APP'),
      description: t('arppDescription')
    },
    {
      title: t('Trinity Square'),
      description: t('trinitySquareDescription')
    }
  ];

  return (
    <Stack alignItems="center" pb="10rem" pt="5rem" spacing={4} sx={{width: '100%'}}>
      <Typography component="h2" variant="h2">
        {t('Digital Neighbours')}
      </Typography>
      <Typography component="p">{t('digitalNeighboursText')}</Typography>
      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={3}
        
      >
        {cards.map((card, index) => (
          <s.NeighbourCard key={card.title} $filled={index % 2 === 0}>
            <Typography component="h4" variant="h4">
              {card.title}
            </Typography>
            <Typography component="p">{card.description}</Typography>
          </s.NeighbourCard>
        ))}
      </Stack>
    </Stack>
  );
};

export default DigitalNeighboursPanel;
