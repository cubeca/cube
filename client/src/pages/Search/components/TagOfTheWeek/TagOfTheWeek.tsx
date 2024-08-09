// @ts-nocheck
import { register } from 'swiper/element/bundle';
import { Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import useContent from 'hooks/useContent';
import ContentCard from 'components/ContentCard';
import { ContentLoader } from 'components/Loaders';
import { ContentLists } from 'types/enums';
import * as s from './TagOfTheWeek.styled';

import FPOThumb1 from 'assets/images/fpo/cont-art-gal-thumb1.png';
import FPOThumb2 from 'assets/images/fpo/daniels-joffe-PhQ4CpXLEX4-unsplash-thumb.png';
import FPOThumb3 from 'assets/images/fpo/pawel-czerwinski-Kd_IiyO7IqQ-unsplash-thumb.png';
import FPOThumb4 from 'assets/images/fpo/third-top-thumb.png';
import FPOThumb5 from 'assets/images/fpo/Hot-Orange-Furrow-Robert-Christie.png';
import FPOThumb6 from 'assets/images/fpo/cheryl-lhirondelle-artengine1.png';
import { useTranslation } from 'react-i18next';

register();

const Content = () => {
  const { data, isLoading } = useContent('featured', ContentLists.Featured);
  const { t } = useTranslation('about');

  const content = [
    {
      id: 0,
      thumbnailUrl: FPOThumb6,
      title:
        'Cheryl L`Hirondelle, Interspecies Communication',
      url: 'https://www.cubecommons.ca/content/5e7382ba-3e4a-4f14-8035-1e04e14d1578',
      icon: 'video',
      hasSignLanguage: false
    },
    {
      id: 1,
      thumbnailUrl: FPOThumb2,
      title: 'Faye HeavyShield, CAG (French)',
      url: 'https://cubecommons.ca/content/9dc02c2f-6d9c-485b-971d-818f23b3267b',
      icon: 'video',
      hasSignLanguage: false
    },
    {
      id: 2,
      thumbnailUrl: FPOThumb5,
      title:
        'Robert Christie, Talking About Hot Orange Furrow',
      url: 'https://www.cubecommons.ca/content/2e0199b2-b136-4b81-9b43-5612051c22a6?playlist=38d62a5a-9424-4f2b-bee6-369d76cda89b',
      icon: 'audio',
      hasSignLanguage: false
    },
    {
      id: 3,
      thumbnailUrl: FPOThumb3,
      title: 'Faye HeavyShield, CAG (English)',
      url: 'https://cubecommons.ca/content/642afc53-60f2-4eb7-89eb-459b8d6ce0be',
      icon: 'audio',
      hasSignLanguage: false
    },
    {
      id:4,
      thumbnailUrl: FPOThumb1,
      title: 'Alex Morrison, Nooks and Corners',
      url: 'https://cubecommons.ca/content/4f0b89ba-9104-4806-91c4-a86cb71a2751',
      icon: 'video',
      hasSignLanguage: false
    },
    {
      id: 5,
      thumbnailUrl: FPOThumb4,
      title:
        'XICANX Dreamers + Changemakers / Soñadores + creadores del cambio',
      url: 'https://www.cubecommons.ca/content/bc3610ab-9bf6-4283-81a9-ce1287a45570',
      icon: 'video',
      hasSignLanguage: false
    }
  ];

  return (
    <s.ContentWrapper>
      <s.ContentHeader container>
        <Grid xs={10} xsOffset={1} md={5} mdOffset={1}>
          <Typography component="h3" variant="h3">
            <span>{t('featuredTag')}</span>
          </Typography>
        </Grid>
      </s.ContentHeader>

      <s.Content>
        {!isLoading ? (
          <swiper-container
            slides-per-view="auto"
            mousewheel="true"
            direction="horizontal"
          >
            {content.map((key: any) => (
              <swiper-slide key={key.id}>
                <ContentCard
                  key={key.id}
                  image={key.thumbnailUrl}
                  title={key.title}
                  creator={key.creator}
                  url={key.url}
                  icon={key.icon}
                  hasSignLanguage={key.hasSignLanguage}
                />
              </swiper-slide>
            ))}
          </swiper-container>
        ) : (
          <ContentLoader size={6} />
        )}
      </s.Content>
    </s.ContentWrapper>
  );
};

export default Content;
