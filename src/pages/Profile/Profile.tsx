import { Box, Grid, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import VideoList from 'components/VideoList';
import useProfile from 'hooks/useProfile';
import { useState } from 'react';
import ViewSection from './View/ViewSection';
import EditSection from './Edit/EditSection';
import { useNavigate } from 'react-router-dom';
import Button from 'components/Button';

const Profile = () => {
  const { t } = useTranslation();
  const { data: profile, isLoading } = useProfile();
  const isLoggedIn = true;
  const [editSection, setEditSection] = useState(false);
  const navigate = useNavigate();

  const handleNewMedia = () => {
    navigate(`/profile/${profile!.id}/upload`);
  };

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
          {editSection ? (
            <EditSection profile={profile!} setIsEditing={setEditSection} />
          ) : (
            <ViewSection
              profile={profile!}
              isLoggedIn={isLoggedIn}
              onEdit={() => setEditSection(true)}
            />
          )}
        </Grid>
      </Grid>
      {isLoggedIn && (
        <Box>
          <Button onClick={handleNewMedia} fullWidth={false}>
            {t('+ New')}
          </Button>
        </Box>
      )}
      <Stack pt="2rem" pb="10rem" px="5rem">
        {profile!.videos?.map((list) => (
          <VideoList
            key={list.category}
            heading={t(list.category)}
            videos={list.videos}
            isLoggedIn={isLoggedIn}
            handleNewMedia={handleNewMedia}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default Profile;
