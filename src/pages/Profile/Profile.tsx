import { Grid, Stack, Typography } from '@mui/material';
import MediaPlayer from 'components/MediaPlayer';
import { useTranslation } from 'react-i18next';
import VideoList from 'components/VideoList';
import useProfile from 'hooks/useProfile';

const Profile = () => {
  const { t } = useTranslation();
  const { data: profile, isLoading } = useProfile();

  console.log(isLoading, profile);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Stack px="5rem">
      <Grid container spacing={10}>
        <Grid item xs={8}>
          <img src={profile!.heroUrl} alt="" width="100%" />
        </Grid>
        <Grid item xs={4}>
          <Stack direction="column">
            <Stack direction="row">
              <img src={profile!.logoUrl} alt="" />
              <Typography component="h2" variant="h3" pl="20px">
                {profile!.name}
              </Typography>
            </Stack>
            <Typography component="p" py="2rem">
              {profile!.description}
            </Typography>
            <MediaPlayer url={profile!.descriptionUrl} isAudio />
          </Stack>
        </Grid>
      </Grid>
      <Stack pt="2rem" pb="10rem" px="5rem">
        {profile!.videos?.map((list) => (
          <VideoList
            key={list.category}
            heading={t(list.category)}
            videos={list.videos}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default Profile;
