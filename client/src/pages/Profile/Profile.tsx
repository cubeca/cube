import { Box, Stack, Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import { useTranslation } from 'react-i18next';
import ContentList from 'components/ContentList/index';
import useProfile from 'hooks/useProfile';
import { useState } from 'react';
import ViewSection from './View/ViewSection';
import EditSection from './Edit/EditSection';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'components/Button';
import EditIcon from '@mui/icons-material/Edit';
import CategorizedContent from '../Home/components/CategorizedContent/index';
import UserContent from './UserContent';
import ReactPlayer from 'react-player';
import { Upload } from '@mui/icons-material';
import Footer from 'components/layout/Footer';
import profileHeroUrl from 'assets/images/profile-hero-bg.jpg';
import * as s from './Profile.styled';

const Profile = () => {
  const { t } = useTranslation();
  const { data: profile, isLoading } = useProfile();
  const isLoggedIn = true;
  const [editSection, setEditSection] = useState(false);
  const navigate = useNavigate();

  console.log(profile);

  const handleNewMedia = () => {
    if (profile) {
      // navigate(`/profile/${profile!.id}/upload`);
      navigate(`upload`);
    }
  };
  // backgroundImage: `url('${profile!.heroUrl}')`,

  const onEditCoverPhoto = () => {};

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      <s.UserProfile>
        {editSection ? (
          <EditSection profile={profile!} setIsEditing={setEditSection} />
        ) : (
          <ViewSection
            profile={profile!}
            isLoggedIn={isLoggedIn}
            onEdit={() => setEditSection(true)}
          />
        )}
      </s.UserProfile>

      <s.UserHeroBg>
        <img src={profileHeroUrl} alt="user profile hero" />
      </s.UserHeroBg>

      <Grid container>
        <Grid xs={10} xsOffset={1} md={7}>
          {isLoggedIn && (
            <s.UserContentHeader
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography component="h3" variant="h3">
                {t('Your Content')}
              </Typography>
              <Button onClick={handleNewMedia} fullWidth={false}>
                {t('+ Upload')}
              </Button>
            </s.UserContentHeader>
          )}

          <UserContent />
        </Grid>
      </Grid>

      <Footer />
    </Box>
  );
};

export default Profile;
