import { MenuItem, Stack } from '@mui/material';
import VideoCard from 'components/VideoCard';
import { useTranslation } from 'react-i18next';
import * as s from './CategorizedVideos.styled';
import { useState } from 'react';
import { MediaCategories, VideoLists } from 'types/enums';
import useVideos from 'hooks/useVideos';
import { VideosLoader } from 'components/Loaders';

const CategorizedVideos = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState(
    MediaCategories.Video
  );
  const { data, isLoading } = useVideos(
    VideoLists.Categorized,
    selectedCategory
  );

  const videos = data?.videos ?? [];

  const categories = [
    {
      text: t('Video'),
      value: MediaCategories.Video
    },
    {
      text: t('VR'),
      value: MediaCategories.VR
    },
    {
      text: t('Digital Publications'),
      value: MediaCategories.DigitalPublications
    },
    {
      text: t('Talks'),
      value: MediaCategories.Talks
    },
    {
      text: t('Performances'),
      value: MediaCategories.Performances
    },
    {
      text: t('Cultural Teachings'),
      value: MediaCategories.CulturalTeachings
    }
  ];

  return (
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
            videos.map((video) => (
              <VideoCard
                key={video.title}
                image={video.thumbnailUrl}
                title={video.title}
                creator={video.creator}
                url={video.url}
                icon={video.iconUrl}
              />
            ))
          ) : (
            <VideosLoader size={6} />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CategorizedVideos;
