/**
 * The `User`component serves as a dashboard page for logged-in users on Cube Commons, not to be confused with logged in creators,
 * who have more privileges and access to additional features. The page displays the user's playlists and allows them to create new playlists.
 */

import { Box, Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAuthTokenPayload } from 'utils/auth';
import Button from 'components/Button';
import Footer from 'components/layout/Footer';
import Lottie from 'lottie-react';
import LoadingCubes from 'assets/animations/loading-cubes.json';
import PlaylistPanel from 'components/PlaylistPanel';
import AddToPlaylistModal from 'components/AddToPlaylistModal';
import usePlaylist from 'hooks/usePlaylist';
import useContentDetails from 'hooks/useContentDetails';
import { useDocumentTitle } from 'hooks/useDocumentTitle';

const User = () => {
  const user = getAuthTokenPayload();
  const { t } = useTranslation();
  const [detailedPlaylists, setDetailedPlaylists] = useState<any[]>([]);
  const { fetchContentDetails } = useContentDetails();
  const [userId, setUserId] = useState('');

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
    isLoading,
    refetchPlaylists
  } = usePlaylist('', userId);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tab = queryParams.get('tab');

  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);

  const [selectedPanel, setSelectedPanel] = useState(tab || 'content');

  function handleClose() {
    setIsPlaylistModalOpen(false);
  }

  const openPlaylistModal = () => {
    setIsPlaylistModalOpen(true);
  };

  useDocumentTitle(user?.name ? `${user.name}'s Profile` : 'User Profile');
  
  return (
    <Box>
      <Grid container>
        <Grid xs={10} xsOffset={1} md={7}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline'
            }}
          >
            <Typography
              component="h3"
              variant="h3"
              style={{
                borderBottom: '2px solid',
                borderColor: '#95F5CB',
                paddingBottom: '5px',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedPanel('playlists')}
              mb={2}
            >
              {t('Your Playlists')}
            </Typography>
            <Button onClick={openPlaylistModal} fullWidth={false}>
              {t('+ Playlist')}
            </Button>
          </Box>
          {playlists && (
            <PlaylistPanel
              playlists={playlists?.data || []}
              test={detailedPlaylists}
              profileId={''}
              userId={userId}
              refetchPlaylist={refetchPlaylists}
            />
          )}
          {isLoading && (
            <Box
              sx={{
                display: 'flex',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Lottie
                animationData={LoadingCubes}
                loop
                autoplay
                style={{ height: '500px', width: '500px' }}
              />
            </Box>
          )}
          {!playlists?.data && !isLoading && (
            <Typography
              component="p"
              variant="body2"
              align="left"
              sx={{ padding: '50px 0' }}
            >
              No playlists found. Click the + Playlist button above to create a
              new playlist. You can also create a new playlist directly from the
              play page.
            </Typography>
          )}
        </Grid>
      </Grid>

      <AddToPlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={handleClose}
        profileId={''}
        userId={userId}
        onlyCreate
        userVersion={true}
      />

      <Footer />
    </Box>
  );
};

export default User;
