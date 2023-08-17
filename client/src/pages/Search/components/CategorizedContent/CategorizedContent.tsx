import Grid from '@mui/system/Unstable_Grid';
import ContentCard from 'components/ContentCard';
import { useTranslation } from 'react-i18next';
import * as s from './CategorizedContent.styled';
import { useState } from 'react';
import { ContentCategories, ContentLists } from 'types/enums';
import useContent from 'hooks/useContent';
import { ContentLoader } from 'components/Loaders';
import ContentFilter from './CategorizedContentFilter';

// Category icons
import collaboration from 'assets/icons/type-collaboration.svg';
import video from 'assets/icons/type-video.svg';
import audio from 'assets/icons/type-audio.svg';
import book from 'assets/icons/type-book.svg';
import publication from 'assets/icons/type-publication.svg';

// FPO images
import FPOThumb1 from 'assets/images/fpo/billetto-editorial-dGYN1ApujRo-unsplash-thumb.png';
import FPOThumb2 from 'assets/images/fpo/daniels-joffe-PhQ4CpXLEX4-unsplash-thumb.png';
import FPOThumb3 from 'assets/images/fpo/pawel-czerwinski-Kd_IiyO7IqQ-unsplash-thumb.png';
import FPOThumb4 from 'assets/images/fpo/ryan-stefan-5K98ScREEUY-unsplash-thumb.png';
import FPOThumb5 from 'assets/images/fpo/filip-zrnzevic-QsWG0kjPQRY-unsplash-thumb.png';
import FPOThumb6 from 'assets/images/fpo/coline-beulin-oLWGI-Q76Yc-unsplash-thumb.png';
import FPOThumb7 from 'assets/images/fpo/abi-baurer-2xbcFBRGsZo-unsplash-thumb.png';
import FPOThumb8 from 'assets/images/fpo/eldar-nazarov-gnYfMrL0rck-unsplash-thumb.png';

const CategorizedContent = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState(
    ContentCategories.Video
  );
  const { data, isLoading } = useContent(
    ContentLists.Categorized,
    selectedCategory
  );

  // Dummy content used for layout purposes: 
  // const content = data || [
  const content = [
    {
      id: 0,
      thumbnailUrl: FPOThumb1,
      title: 'Video Title',
      url: 'https://www.example.com',
      iconUrl: video
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb2,
      title: 'Video Title',
      url: 'https://www.example.com',
      iconUrl: video
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb3,
      title: 'Video Title',
      url: 'https://www.example.com',
      iconUrl: video
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb4,
      title: 'Audio Title',
      url: 'https://www.example.com',
      iconUrl: audio
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb5,
      title: 'Audio Title',
      url: 'https://www.example.com',
      iconUrl: audio
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb6,
      title: 'Audio Title',
      url: 'https://www.example.com',
      iconUrl: audio
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb7,
      title: 'Book Title',
      url: 'https://www.example.com',
      iconUrl: book
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb8,
      title: 'Book Title',
      url: 'https://www.example.com',
      iconUrl: book
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb1,
      title: 'Book Title',
      url: 'https://www.example.com',
      iconUrl: book
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb2,
      title: 'Publication Title',
      url: 'https://www.example.com',
      iconUrl: publication
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb3,
      title: 'Publication Title',
      url: 'https://www.example.com',
      iconUrl: publication
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb4,
      title: 'Publication Title',
      url: 'https://www.example.com',
      iconUrl: publication
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb5,
      title: 'Collaboration Title',
      url: 'https://www.example.com',
      iconUrl: collaboration
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb6,
      title: 'Collaboration Title',
      url: 'https://www.example.com',
      iconUrl: collaboration
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb7,
      title: 'Collaboration Title',
      url: 'https://www.example.com',
      iconUrl: collaboration
    }
  ];

  return (

    <s.ContentWrapper>
      <Grid container>
        <Grid xs={10} xsOffset={1}>
        
          <ContentFilter />

          <s.Content>
            {!isLoading ? (
              content.map((key: any) => (
                <ContentCard
                  key={key.id}
                  image={key.thumbnailUrl}
                  title={key.title}
                  creator={key.creator}
                  url={key.url}
                  icon={key.iconUrl}
                />
              ))
            ) : (
              <ContentLoader size={6} />
            )}
          </s.Content>

          

          { /* This is the original code from the template : */

          /* 
          This list may map to database categories but it isn't consistant with content types defined in Figma designs. 
          Figma designs have the following content types:
          - Video
          - Audio
          - Activity Booklets
          - Digital Publications
          - Collaborations
          - External Link
          */
          
          /*
          { const categories = [
            {
              text: t('Video'),
              value: ContentCategories.Video
            },
            {
              text: t('VR'),
              value: ContentCategories.VR
            },
            {
              text: t('Digital Publications'),
              value: ContentCategories.DigitalPublications
            },
            {
              text: t('Talks'),
              value: ContentCategories.Talks
            },
            {
              text: t('Performances'),
              value: ContentCategories.Performances
            },
            {
              text: t('Cultural Teachings'),
              value: ContentCategories.CulturalTeachings
            }
          ]; }

          <Stack>
            <s.Categories component="ul">
              {categories.map((category) => (
                <MenuItem
                  key={category.text}
                  onClick={() => {
                    setSelectedCategory(category.value);
                  }}
                  sx={{ padding: '1rem' }}
                  selected={selectedCategory === category.value}
                >
                  {category.text}
                </MenuItem>
              ))}
            </s.Categories>
            <Stack spacing={2} py="4rem">
              <Stack direction="row" spacing={6}>
                {!isLoading ? (
                  content.map((c: any) => (
                    <ContentCard
                      key={c.title}
                      image={c.thumbnailUrl}
                      title={c.title}
                      creator={c.creator}
                      url={c.url}
                      icon={c.iconUrl}
                    />
                  ))
                ) : (
                  <ContentLoader size={6} />
                )}
              </Stack>
            </Stack>
          </Stack>
          */}

        </Grid>
      </Grid>
    </s.ContentWrapper>
    
  );
};

export default CategorizedContent;
