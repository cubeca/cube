import { Box, Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import { useTranslation } from 'react-i18next';
import useProfile from 'hooks/useProfile';
import { useEffect, useState } from 'react';
import ViewSection from './View/ViewSection';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { getAuthTokenPayload } from 'utils/auth';
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
import useContentDetails from 'hooks/useContentDetails';

const Profile = () => {
  const user = getAuthTokenPayload();
  const { t } = useTranslation();
  const { data: profile, isLoading, refetch } = useProfile();
  const [playlist, setPlaylist] = useState(null);
  const [detailedPlaylists, setDetailedPlaylists] = useState<any[]>([]);
  const [transformedPlaylists, setTransformedPlaylists] = useState<any[]>([]);
  const { fetchContentDetails } = useContentDetails();
  const [playlistData, setPlaylistData] = useState<[]>([]);
  const [userId, setUserId] = useState('');
  const [profileId, setProfileId] = useState('');
  useEffect(() => {
    setProfileId(profile?.profileId || '');
  }, [profile]);

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
    deletePlaylist: handleDeletePlaylist
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

  // for testing purposes, quickly create a test playlist
  const createPlaylist = async () => {
    const newPlaylistt = {
      title: 'Playlist of dreams and testing',
      description: 'lorem ipsum dolor sit amet and all that jazz',
      profileId: profileId,
      userId: userId,
      contentIds: [
        '27c31a1f-8a84-4016-9d8f-66e1d867ce2e',
        'fbc173fe-0e48-4411-bf17-97f3c5d7ef58',
        '80179c0d-896b-4773-92d1-93a60ce9d16f'
      ]
    };

    try {
      await handleAddPlaylist(newPlaylistt);
      console.log('Playlist created successfully');
    } catch (error) {
      console.error('Failed to create playlist', error);
    }
  };

  return (
    <Box>
      <s.UserHeroBg>
        {profile.heroUrl && (
          <img src={profile!.heroUrl} alt="user profile hero" />
        )}
        {!profile && (
          <Lottie
            className="loading-circle"
            animationData={LoadingCircle}
            loop={true}
            autoplay={true}
          />
        )}
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
                >
                  {t('Playlists')}
                </Typography>
              </s.UserContentSubWrapper>
              {/* )} */}
              <s.UserContentSubWrapper>
                <Button onClick={openPlaylistModal} fullWidth={false}>
                  {t('+ Playlist')}
                </Button>
                <Button onClick={handleNewMedia} fullWidth={false}>
                  {t('+ Upload')}
                </Button>
              </s.UserContentSubWrapper>
            </s.UserContentHeader>
          )}

          {selectedPanel === 'content' ? (
            <UserContent profile={profile} />
          ) : (
            <PlaylistPanel
              playlists={playlists?.data}
              test={detailedPlaylists}
              profileId={profileId}
              userId={userId}
              isLoading={isLoading}
            />
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
