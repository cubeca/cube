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
import FPOThumb5 from 'assets/images/fpo/first-bottom-thumb.png';
import FPOThumb6 from 'assets/images/fpo/third-bottom-thumb.png';

register();

const Content = () => {
  const { data, isLoading } = useContent('featured', ContentLists.Featured);

  // const content = data || [
  const content = [
    {
      id: 0,
      thumbnailUrl: FPOThumb1,
      title: 'Alex Morrison, Nooks and Corners',
      url: '/',
      icon: 'video',
      hasSignLanguage: false
    },
    {
      id: 1,
      thumbnailUrl: FPOThumb2,
      title: 'Faye HeavyShield (French)',
      url: '/',
      icon: 'video',
      hasSignLanguage: false
    },
    {
      id: 2,
      thumbnailUrl: FPOThumb4,
      title:
        'XICANX Dreamers + Changemakers / Soñadores + creadores del cambio',
      url: 'https://www.cubecommons.ca/content/bc3610ab-9bf6-4283-81a9-ce1287a45570',
      icon: 'video',
      hasSignLanguage: false
    },
    {
      id: 3,
      thumbnailUrl: FPOThumb3,
      title: 'Faye HeavyShield (English)',

      url: '/',
      icon: 'audio',
      hasSignLanguage: false
    },
    {
      thumbnailUrl: FPOThumb5,
      title:
        'XICANX Dreamers + Changemakers / Soñadores + creadores del cambio',
      url: 'https://www.cubecommons.ca/content/3f15f034-b952-4101-a64a-79b9d0dda987',
      icon: 'audio',
      hasSignLanguage: false
    },
    {
      id: 5,
      thumbnailUrl: FPOThumb6,
      title: 'How to feel unsafe in a safe way',
      url: 'https://www.cubecommons.ca/content/79cf81ff-b033-40d9-84a9-e371c15945c3',
      icon: 'video'
    }
  ];

  return (
    <s.ContentWrapper>
      <s.ContentHeader container>
        <Grid xs={10} xsOffset={1} md={5} mdOffset={1}>
          <Typography component="h3" variant="h3">
            <span>Featured content:</span>
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
