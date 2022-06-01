import { MenuItem, Stack, Typography } from '@mui/material';
import Select from 'components/form/Select';
import VideoCard from 'components/VideoCard';
import { useTranslation } from 'react-i18next';
import { Country, MediaTypes } from 'types/enums';
import VideoImage from 'assets/images/video-image.jpg';
import CreatorAvatar from 'assets/icons/creator-avatar.svg';

import * as s from './FilteredVideos.styled';

const FilteredVideos = () => {
  const { t } = useTranslation();

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

  return (
    <>
      <s.Filters direction="row" spacing={2} alignItems="center">
        <Typography component="span">{t('Show me')}</Typography>
        <Select
          label={t('All Media Types')}
          onChange={(value: string | number) => {
            console.log(value);
          }}
        >
          <MenuItem value={MediaTypes.Video}>{t('Video')}</MenuItem>
          <MenuItem value={MediaTypes.Audio}>{t('Audio')}</MenuItem>
          <MenuItem value={MediaTypes.VR}>{t('VR')}</MenuItem>
          <MenuItem value={MediaTypes.DigitalPublications}>
            {t('Digital Publications')}
          </MenuItem>
          <MenuItem value={MediaTypes.Talks}>{t('Talks')}</MenuItem>
          <MenuItem value={MediaTypes.Performances}>
            {t('Performances')}
          </MenuItem>
          <MenuItem value={MediaTypes.CulturalTeachings}>
            {t('Cultural Teachings')}
          </MenuItem>
        </Select>
        <Typography component="span">{t('of content')}</Typography>
        <Select
          label={t('In Country')}
          onChange={(value: string | number) => {
            console.log(value);
          }}
          value={Country.Canada}
        >
          <MenuItem value={Country.Canada}>{t('In')} Canada</MenuItem>
        </Select>
        <Select
          label={t('By Any Content Creator')}
          onChange={(value: string | number) => {
            console.log(value);
          }}
        >
          <MenuItem value={'some content creator'}>
            Some content creator
          </MenuItem>
        </Select>
        <Select
          label={t('Items per Page')}
          onChange={(value: string | number) => {
            console.log(value);
          }}
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={15}>15</MenuItem>
          <MenuItem value={20}>20</MenuItem>
        </Select>
      </s.Filters>
      <Stack direction="row" spacing={2} py="4rem">
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
    </>
  );
};

export default FilteredVideos;
