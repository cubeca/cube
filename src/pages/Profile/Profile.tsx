import { Grid, Stack, Typography } from '@mui/material';
import ProfileHero from 'assets/images/profile-image.jpg';
import MoaIcon from 'assets/icons/moa.svg';
import MediaPlayer from 'components/MediaPlayer';
import { useTranslation } from 'react-i18next';
import VideoImage from 'assets/images/video-image.jpg';
import VideoList from './components/VideoList';

const Profile = () => {
  const { t } = useTranslation();

  const videos = [
    {
      image: VideoImage,
      title: 'title',
      url: '/videos/abc123'
    },
    {
      image: VideoImage,
      title: 'title',
      url: '/videos/abc123'
    },
    {
      image: VideoImage,
      title: 'title',
      url: '/videos/abc123'
    }
  ];
  return (
    <Stack px="5rem">
      <Grid container spacing={10}>
        <Grid item xs={8}>
          <img src={ProfileHero} alt="" width="100%" />
        </Grid>
        <Grid item xs={4}>
          <Stack direction="column">
            <Stack direction="row">
              <img src={MoaIcon} alt="" />
              <Typography component="h2" variant="h3" pl="20px">
                MOA
              </Typography>
            </Stack>
            <Typography component="p" py="2rem">
              Description of MOA Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Ornare risus pretium vivamus leo, pharetra
              placerat mauris, viverra. Phasellus parturient amet sapien
              praesent semper tellus porttitor at auctor. Faucibus in at blandit
              dui eget in ut enim. Ultricies eu, lobortis vitae bibendum nunc
              tempor. Quam.
            </Typography>
            <MediaPlayer
              url="https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3"
              isAudio
            />
          </Stack>
        </Grid>
      </Grid>
      <Stack pt="2rem" pb="10rem" px="5rem">
        <VideoList heading={t('Videos')} videos={videos} />
        <VideoList heading={t('Audio')} videos={videos} />
        <VideoList heading={t('Activity Booklets')} videos={videos} />
        <VideoList heading={t('Digital Publications')} videos={videos} />
        <VideoList heading={t('Collaborations')} videos={videos} />
      </Stack>
    </Stack>
  );
};

export default Profile;
