import { Box, Grid, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ContentList from 'components/ContentList';
import useProfile from 'hooks/useProfile';
import { useState } from 'react';
import ViewSection from './View/ViewSection';
import EditSection from './Edit/EditSection';
import { useNavigate } from 'react-router-dom';
import Button from 'components/Button';
import EditIcon from '@mui/icons-material/Edit';
import CategorizedContent from '../Home/components/CategorizedContent/index';
import FeaturedContent from '../Home/components/FeaturedContent/index';
import ContentByMedium from './ContentByMedium/index'

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
    <Stack>
      <Box sx={{position:'fixed', zIndex:'9', width: '100%'}}>
      <img src={profile!.heroUrl} alt="" width="100%"/>
      {/* <CategorizedContent /> */}
        <FeaturedContent/>
      <ContentByMedium />
  </Box>
  <Box sx={{zIndex: '12'}}>
      {editSection ? (
            <EditSection profile={profile!} setIsEditing={setEditSection} />
          ) : (
            <ViewSection
              profile={profile!}
              isLoggedIn={isLoggedIn}
              onEdit={() => setEditSection(true)}
            />
          )}
  </Box>
    
      {/* {isLoggedIn && (
        <Box>
          <Button onClick={handleNewMedia} fullWidth={false}>
            {t('+ New')}
          </Button>
        </Box>
      )}
      <Stack pt="2rem" pb="10rem" px="5rem">
        {profile!.content?.map((list) => (
          <ContentList
            key={list.category}
            heading={t(list.category)}
            content={list.content}
            isLoggedIn={isLoggedIn}
            handleNewMedia={handleNewMedia}
          />
        ))}
      </Stack> */}
      
    </Stack>
    
  );
};

export default Profile;
