import { Box, Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import { useTranslation } from 'react-i18next';
import useProfile from 'hooks/useProfile';
import { useState } from 'react';
import ViewSection from './View/ViewSection';
import { useNavigate } from 'react-router-dom';
import Button from 'components/Button';
import UserContent from './UserContent';
import Footer from 'components/layout/Footer';
import Lottie from 'lottie-react';
import LoadingCircle from 'assets/animations/loading-circle.json';
import * as s from './Profile.styled';
import useAuth from 'hooks/useAuth';
import EditDialog from './Edit/EditDialog';

const Profile = () => {
  const { t } = useTranslation();
  const { data: profile, isLoading } = useProfile();
  const { isLoggedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNewMedia = () => {
    if (profile) {
      navigate(`upload`);
    }
  };

  if (isLoading) {
    // return <div>Loading...</div>;
  }

  return (
    <Box>
      <s.UserHeroBg>
        {profile.heroUrl && <img src={profile!.heroUrl} alt='user profile hero' />}
        {!profile && <Lottie
          className="loading-circle"
          animationData={LoadingCircle}
          loop={true}
          autoplay={true}
        />}
      </s.UserHeroBg>

      <s.UserProfile>
        <ViewSection
          profile={profile!}
          isLoggedIn={isLoggedIn}
          onEdit={() => setIsOpen(true)}
        />
      </s.UserProfile>

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

          <UserContent content={profile?.content}/>
        </Grid>
      </Grid>
      <EditDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        profile={profile!}
      />

      <Footer />
    </Box>
  );
};

export default Profile;
