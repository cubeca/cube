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
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LinkIcon from '@mui/icons-material/Link';

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
      title: 'Lorem ipsum dolor sit amet consectetur adipiscing elit',
      url: 'https://www.example.com',
      icon: <PlayArrowIcon fontSize="small" />,
      hasSignLanguage: true
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb2,
      title: 'Video Title',
      url: 'https://www.example.com',
      icon: <PlayArrowIcon fontSize="small" />,
      hasSignLanguage: false
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb3,
      title: 'Video Title',
      url: 'https://www.example.com',
      icon: <PlayArrowIcon fontSize="small" />,
      hasSignLanguage: false
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb4,
      title: 'Audio Title',
      url: 'https://www.example.com',
      icon: <VolumeUpIcon fontSize="small" />,
      hasSignLanguage: false
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb5,
      title: 'Audio Title',
      url: 'https://www.example.com',
      icon: <VolumeUpIcon fontSize="small" />,
      hasSignLanguage: false
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb6,
      title: 'Audio Title',
      url: 'https://www.example.com',
      icon: <VolumeUpIcon fontSize="small" />,
      hasSignLanguage: false
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb7,
      title: 'Book Title',
      url: 'https://www.example.com',
      icon: <MenuBookIcon fontSize="small" />,
      hasSignLanguage: false
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb8,
      title: 'Book Title',
      url: 'https://www.example.com',
      icon: <MenuBookIcon fontSize="small" />,
      hasSignLanguage: false
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb1,
      title: 'Book Title',
      url: 'https://www.example.com',
      icon: <MenuBookIcon fontSize="small" />,
      hasSignLanguage: false
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb7,
      title: 'Link Title',
      url: 'https://www.example.com',
      icon: <LinkIcon fontSize="small" />,
      hasSignLanguage: false
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb8,
      title: 'Link Title',
      url: 'https://www.example.com',
      icon: <LinkIcon fontSize="small" />,
      hasSignLanguage: false
    },
    {
      id: 0,
      thumbnailUrl: FPOThumb1,
      title: 'Link Title',
      url: 'https://www.example.com',
      icon: <LinkIcon fontSize="small" />,
      hasSignLanguage: false
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
                  icon={key.icon}
                  hasSignLanguage={key.hasSignLanguage}
                />
              ))
            ) : (
              <ContentLoader size={6} />
            )}
          </s.Content>

        </Grid>
      </Grid>
    </s.ContentWrapper>
    
  );
};

export default CategorizedContent;
