import { Box, Grid, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ContentList from 'components/ContentList/index';
import useProfile from 'hooks/useProfile';
import { useState } from 'react';
import ViewSection from './View/ViewSection';
import EditSection from './Edit/EditSection';
import { useNavigate } from 'react-router-dom';
import Button from 'components/Button';
import EditIcon from '@mui/icons-material/Edit';
import CategorizedContent from '../Home/components/CategorizedContent/index';
import FeaturedContent from '../Home/components/FeaturedContent/index';
import ContentByMedium from './ContentByMedium/index';
import ReactPlayer from 'react-player';
import { Upload } from '@mui/icons-material';
import Footer from 'components/layout/Footer';

const Profile = () => {
  const { t } = useTranslation();
  const { data: profile, isLoading } = useProfile();
  const isLoggedIn = true;
  const [editSection, setEditSection] = useState(false);
  const navigate = useNavigate();

  const handleNewMedia = () => {
    navigate(`/profile/${profile!.id}/upload`);
  };

  const onEditCoverPhoto = () => {};

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ width: '100vw', height: '700px' }}>
      <Box
        sx={{
          width: '100vw',
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'center',
          backgroundImage: `url('${profile!.heroUrl}')`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        }}
      >
        <Grid
          container
          spacing={0}
          // marginTop={'2vh'}
          columnGap="none"
          xs={12}
          md={12}
          flex-direction={{ xs: 'column', sm: 'column', md: 'row' }}
          justifyContent="flex-end"
          pb="60vh"
        >
          <Grid item xs={12} sm={12} md={6} m="5rem"></Grid>
          <Grid item xs={12} sm={12} md={4}>
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
      </Box>
      <Stack sx={{ width: '65vw', marginLeft: '2rem', pt: '2rem' }}>
        <FeaturedContent />
        {isLoggedIn && (
          <Stack
            direction="row"
            spacing={12}
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography component="h4" variant="h4">
              {ContentByMedium.name}
            </Typography>
            <Stack direction="row" spacing={6} alignItems="center">
              <a
                href="https://www.figma.com/file/ZtLeDmMQsNydIvouptZYEq/CubeCommons-v2?node-id=0%3A1&t=UA1wfJoEZOHuqfOR-0"
                title="tap to see all {ContentQueryKeys.Category}"
              >
                <Typography
                  component="h4"
                  variant="h4"
                  sx={{ textUnderline: '1px' }}
                >
                  See All
                </Typography>
              </a>
              <Box>
                <Button onClick={handleNewMedia} fullWidth={false}>
                  {t('+ New')}
                </Button>
              </Box>
            </Stack>
          </Stack>
        )}
        <ContentByMedium />
        <Box sx={{ width: '50%' }}>
          <Button>+ Upload your first</Button>
        </Box>
      </Stack>
      <Box sx={{ width: '70%' }}>
        <Footer />
      </Box>
    </Box>
  );
};

export default Profile;
