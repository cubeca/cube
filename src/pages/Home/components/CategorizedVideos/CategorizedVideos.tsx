import { MenuItem, Stack } from '@mui/material';
import VideoCard from 'components/VideoCard';
import { useTranslation } from 'react-i18next';
import * as s from './CategorizedVideos.styled';
import VideoImage from 'assets/images/video-image.jpg';
import CreatorAvatar from 'assets/icons/creator-avatar.svg';
import { useState } from 'react';
import { MediaTypes } from 'types/enums';

const CategorizedVideos = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState(MediaTypes.Video);
  const videos = [
    {
      image: VideoImage,
      title: 'title',
      creator: 'creator',
      url: '/videos/abc123',
      icon: CreatorAvatar
    },
    {
      image: VideoImage,
      title: 'title',
      creator: 'creator',
      url: '/videos/abc123',
      icon: CreatorAvatar
    },
    {
      image: VideoImage,
      title: 'title',
      creator: 'creator',
      url: '/videos/abc123',
      icon: CreatorAvatar
    },
    {
      image: VideoImage,
      title: 'title',
      creator: 'creator',
      url: '/videos/abc123',
      icon: CreatorAvatar
    },
    {
      image: VideoImage,
      title: 'title',
      creator: 'creator',
      url: '/videos/abc123',
      icon: CreatorAvatar
    }
  ];

  const categories = [
    {
      text: t('Video'),
      value: MediaTypes.Video
    },
    {
      text: t('VR'),
      value: MediaTypes.VR
    },
    {
      text: t('Digital Publications'),
      value: MediaTypes.DigitalPublications
    },
    {
      text: t('Talks'),
      value: MediaTypes.Talks
    },
    {
      text: t('Performances'),
      value: MediaTypes.Performances
    },
    {
      text: t('Cultural Teachings'),
      value: MediaTypes.CulturalTeachings
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
        <Stack direction="row" spacing={2}>
          {videos.map((video) => (
            <VideoCard
              key={video.title}
              image={video.image}
              title={video.title}
              creator={video.creator}
              url={video.url}
              icon={video.icon}
            />
          ))}
        </Stack>
        <Stack direction="row" spacing={2}>
          {videos.map((video) => (
            <VideoCard
              key={video.title}
              image={video.image}
              title={video.title}
              creator={video.creator}
              url={video.url}
              icon={video.icon}
            />
          ))}
        </Stack>
        <Stack direction="row" spacing={2}>
          {videos.map((video) => (
            <VideoCard
              key={video.title}
              image={video.image}
              title={video.title}
              creator={video.creator}
              url={video.url}
              icon={video.icon}
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CategorizedVideos;
