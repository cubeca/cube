// @ts-nocheck
import { register } from 'swiper/element/bundle';
import { Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import useContent from 'hooks/useContent';
import ContentCard from 'components/ContentCard';
import { ContentLoader } from 'components/Loaders';
import { ContentLists } from 'types/enums';
import * as s from './TagOfTheWeek.styled';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LinkIcon from '@mui/icons-material/Link';

import FPOThumb1 from 'assets/images/fpo/billetto-editorial-dGYN1ApujRo-unsplash-thumb.png';
import FPOThumb2 from 'assets/images/fpo/daniels-joffe-PhQ4CpXLEX4-unsplash-thumb.png';
import FPOThumb3 from 'assets/images/fpo/pawel-czerwinski-Kd_IiyO7IqQ-unsplash-thumb.png';
import FPOThumb4 from 'assets/images/fpo/ryan-stefan-5K98ScREEUY-unsplash-thumb.png';
import FPOThumb5 from 'assets/images/fpo/filip-zrnzevic-QsWG0kjPQRY-unsplash-thumb.png';
import FPOThumb6 from 'assets/images/fpo/coline-beulin-oLWGI-Q76Yc-unsplash-thumb.png';

register();

const Content = () => {
  const { data, isLoading } = useContent('featured', ContentLists.Featured);

  // const content = data || [
  const content = [
    {
      id: 0,
      thumbnailUrl: FPOThumb1,
      title: 'Video Title',
      url: 'https://www.example.com',
      icon: <PlayArrowIcon fontSize="small" />,
      hasSignLanguage: true
    },
    {
      id: 1,
      thumbnailUrl: FPOThumb2,
      title: 'Video Title',
      url: 'https://www.example.com',
      icon: <PlayArrowIcon fontSize="small" />
    },
    {
      id: 2,
      thumbnailUrl: FPOThumb3,
      title: 'Video Title',
      url: 'https://www.example.com',
      icon: <PlayArrowIcon fontSize="small" />
    },
    {
      id: 3,
      thumbnailUrl: FPOThumb4,
      title: 'Book Title',
      url: 'https://www.example.com',
      icon: <MenuBookIcon fontSize="small" />
    },
    {
      id: 4,
      thumbnailUrl: FPOThumb5,
      title: 'Audio Title',
      url: 'https://www.example.com',
      icon: <VolumeUpIcon fontSize="small" />
    },
    {
      id: 5,
      thumbnailUrl: FPOThumb6,
      title: 'Link Title',
      url: 'https://www.example.com',
      icon: <LinkIcon fontSize="small" />
    }
  ];

  return (
    <s.ContentWrapper>
      <s.ContentHeader container>
        <Grid xs={10} xsOffset={1} md={5} mdOffset={1}>
          <Typography component="h3" variant="h3">
            <span>Tag of the week:</span> <strong>#queer</strong>
          </Typography>
        </Grid>
      </s.ContentHeader>

      <s.Content>
        {!isLoading ? (
          <swiper-container slides-per-view="auto" mousewheel="true" direction="horizontal">
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
