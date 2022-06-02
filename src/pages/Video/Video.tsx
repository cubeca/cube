import {
  Divider,
  Grid,
  Link,
  Stack,
  Typography,
  useTheme
} from '@mui/material';
import MediaPlayer from 'components/MediaPlayer';
import VideoImage from 'assets/images/video-image.jpg';
import { useTranslation } from 'react-i18next';
import VideoList from 'components/VideoList';
import MoaIcon from 'assets/icons/moa.svg';
import CreatorIcon from 'assets/icons/creator-avatar.svg';

const Video = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const video = {
    title: 'Title',
    date: '01/01/2022',
    description:
      'Description of content Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dolor sem faucibus auctor quam pretium massa nulla cursus. Vel, a nisl ipsum, nisl. Mauris.',
    contributors: [
      {
        icon: MoaIcon,
        name: 'Museum of Anthropology',
        link: 'link',
        handle: '@Moa'
      },
      {
        icon: CreatorIcon,
        name: 'Museum of Vancouver',
        link: 'link',
        handle: '@Mov'
      },
      {
        icon: CreatorIcon,
        name: 'Dana Claxton'
      }
    ],
    credits:
      'Dawn Powell, Camera Operator, Alissa Cat, Public Programs Magnus Ten, Editor'
  };

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
    }
  ];
  return (
    <Grid container spacing={5} px="5rem">
      <Grid item xs={8}>
        <MediaPlayer
          url="https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3"
          width="100%"
        />
      </Grid>
      <Grid item xs={4}>
        <Stack>
          {video.contributors.map((contributor) => (
            <Stack key={contributor.handle} pb="1rem">
              <Stack direction="row" alignItems="flex-start">
                <img
                  src={contributor.icon}
                  alt=""
                  style={{ paddingRight: '10px' }}
                  width="50"
                />
                <Stack pt="5px">
                  <Typography component="p" sx={{ fontWeight: 'bold' }}>
                    {contributor.name}
                  </Typography>
                  {contributor.link && (
                    <Link href={contributor.link}>{contributor.handle}</Link>
                  )}
                </Stack>
              </Stack>
            </Stack>
          ))}
          <Typography component="h4" variant="body1">
            {video.title}
          </Typography>
          <Typography component="p" variant="body1">
            {video.date}
          </Typography>
          <Stack
            spacing={3}
            padding="20px"
            sx={{
              background: theme.palette.grey[800],
              borderRadius: theme.shape.borderRadius
            }}
          >
            <Typography component="p">{video.description}</Typography>
            <MediaPlayer
              url="https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3"
              isAudio
            />
          </Stack>
          <Stack pt="2rem">
            <Typography component="h4" sx={{ fontWeight: 'bold' }}>
              {t('Credits')}
            </Typography>
            <Typography component="p" sx={{ fontWeight: 'bold' }}>
              {video.credits}
            </Typography>
          </Stack>
          <Divider sx={{ margin: '2rem 0' }} light />
          <Stack>
            <Typography component="h4" pb="1rem" sx={{ fontWeight: 'bold' }}>
              {t('More Content')}
            </Typography>
            <VideoList videos={videos} />
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Video;
