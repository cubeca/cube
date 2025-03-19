/**
 * `Profile` serves as the main container for a user's profile page.
 * It utilizes the `useProfile` hook for fetching the logged-in user's profile data.
 * It displays various sections of the profile, such as `ViewSection` for viewing profile details, `UserContent` for displaying
 * the user's content, and `PrivateContent` for private items. Additionally, it includes `EditDialog` for editing profile information,
 * `PlaylistPanel` for managing playlists, and `AddToPlaylistModal` for adding items to playlists.
 */

import { Box, Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import { useTranslation } from 'react-i18next';
import useProfile from 'hooks/useProfile';
import { useEffect, useState } from 'react';
import ViewSection from './View/ViewSection';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { getAuthTokenPayload, getProfileId } from 'utils/auth';
import Button from 'components/Button';
import UserContent from './UserContent';
import Footer from 'components/layout/Footer';
import Lottie from 'lottie-react';
import LoadingCircle from 'assets/animations/loading-circle.json';
import * as s from './Profile.styled';
import useAuth from 'hooks/useAuth';
import EditDialog from './Edit/EditDialog';
import PlaylistPanel from 'components/PlaylistPanel';
import AddToPlaylistModal from 'components/AddToPlaylistModal';
import usePlaylist from 'hooks/usePlaylist';
import { useParams } from 'react-router-dom';
import PrivateContent from './PrivateContent';
import { useDocumentTitle } from 'hooks/useDocumentTitle';

const Profile = () => {
  const user = getAuthTokenPayload();
  const { t } = useTranslation();
  const { data: profile, isLoading, refetch } = useProfile();
  const loggedInProfileId = getProfileId();
  const [detailedPlaylists, setDetailedPlaylists] = useState<any[]>([]);
  const [userId, setUserId] = useState('');
  const [profileId, setProfileId] = useState('');
  const { tag: navigatedProfileTag } = useParams();
  const { tag } = useParams();

  useDocumentTitle(`Profile - ${tag || ''}`);

  useEffect(() => {
    setProfileId(profile?.profileId || '');
  }, [profile]);

  useEffect(() => {
    refetch();
  }, [navigatedProfileTag]);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getAuthTokenPayload();
      setUserId((user as any).sub);
    };

    fetchUser();
  }, [user]);

  const {
    playlists,
    addPlaylist: handleAddPlaylist,
    deletePlaylist: handleDeletePlaylist,
    refetchPlaylists: refetchPlaylists
  } = usePlaylist(profileId, '');

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tab = queryParams.get('tab');

  const { isLoggedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);

  const [selectedPanel, setSelectedPanel] = useState(tab || 'content');
  const navigate = useNavigate();

  const handleNewMedia = () => {
    if (profile) {
      navigate(`upload`);
    }
  };

  const handleUploadComplete = () => {
    refetch();
  };
  function handleClose() {
    setIsPlaylistModalOpen(false);
  }

  const openPlaylistModal = () => {
    setIsPlaylistModalOpen(true);
  };

  const isOwnProfile = loggedInProfileId === profile?.id;

  return (
    <Box>
      <s.UserHeroBg>
        {profile.heroUrl && (
          <img
            src={profile!.heroUrl}
            alt="user profile hero"
            aria-label="user profile hero image"
          />
        )}
        {!profile && (
          <Lottie
            className="loading-circle"
            animationData={LoadingCircle}
            loop={true}
            autoplay={true}
            aria-label="loading animation"
          />
        )}
      </s.UserHeroBg>

      <s.UserProfile>
        <ViewSection
          profile={profile!}
          isLoggedIn={isLoggedIn}
          onEdit={() => setIsOpen(true)}
          loggedInProfileId={loggedInProfileId || ''}
        />
      </s.UserProfile>

      <Grid container>
        <Grid xs={10} xsOffset={1} md={7}>
          {isLoggedIn && isOwnProfile && (
            <s.UserContentHeader
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
            >
              <s.UserContentSubWrapper>
                <Typography
                  component="h3"
                  variant="h3"
                  style={{
                    borderBottom: '2px solid',
                    borderColor:
                      selectedPanel === 'content' ? '#95F5CB' : 'transparent',
                    paddingBottom: '5px',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedPanel('content')}
                  aria-label="button to select content tab"
                >
                  {t('Content')}
                </Typography>
                <Typography
                  component="h3"
                  variant="h3"
                  style={{
                    borderBottom: '2px solid',
                    borderColor:
                      selectedPanel === 'playlists' ? '#95F5CB' : 'transparent',
                    paddingBottom: '5px',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedPanel('playlists')}
                  aria-label="button to select playlists tab"
                >
                  {t('Playlists')}
                </Typography>
                {isOwnProfile && (
                  <Typography
                    component="h3"
                    variant="h3"
                    style={{
                      borderBottom: '2px solid',
                      borderColor:
                        selectedPanel === 'private' ? '#95F5CB' : 'transparent',
                      paddingBottom: '5px',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedPanel('private')}
                    aria-label="button to select private content tab"
                  >
                    {t('Private')}
                  </Typography>
                )}
              </s.UserContentSubWrapper>
              <s.UserContentSubWrapper>
                {selectedPanel === 'playlists' ? (
                  <Button
                    onClick={openPlaylistModal}
                    fullWidth={false}
                    aria-label="button to create a new playlist"
                  >
                    {t('+ Playlist')}
                  </Button>
                ) : null}
                {selectedPanel === 'content' || selectedPanel === 'private' ? (
                  <Button
                    onClick={handleNewMedia}
                    fullWidth={false}
                    aria-label="button to upload new content"
                  >
                    {t('+ Upload')}
                  </Button>
                ) : null}
              </s.UserContentSubWrapper>
            </s.UserContentHeader>
          )}

          {selectedPanel === 'content' && !isLoading ? (
            <UserContent
              profile={profile}
              isLoading={isLoading}
              key={profile?.id}
            />
          ) : selectedPanel === 'private' && isOwnProfile ? (
            <PrivateContent
              profile={profile}
              isLoading={isLoading}
              key={profile?.id}
            />
          ) : (
            <>
              <Box sx={{ mt: 5 }}></Box>
              <PlaylistPanel
                playlists={playlists?.data}
                test={detailedPlaylists}
                profileId={profileId}
                userId={userId}
                isLoading={isLoading}
                refetchPlaylists={refetchPlaylists}
                isLoggedIn={isLoggedIn}
              />
            </>
          )}
        </Grid>
      </Grid>
      <EditDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        profile={profile!}
        onUploadComplete={handleUploadComplete}
      />
      <AddToPlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={handleClose}
        profileId={profileId}
        userId={userId}
        onlyCreate
      />

      <Footer />
    </Box>
  );
};

export default Profile;
