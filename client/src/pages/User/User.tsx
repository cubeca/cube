import { Box, Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import { useTranslation } from 'react-i18next';
import useProfile from 'hooks/useProfile';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { getAuthTokenPayload } from 'utils/auth';
import Button from 'components/Button';
import Footer from 'components/layout/Footer';
import Lottie from 'lottie-react';
import LoadingCircle from 'assets/animations/loading-circle.json';
import * as s from './User.styled';
import useAuth from 'hooks/useAuth';
import PlaylistPanel from 'components/PlaylistPanel';
import AddToPlaylistModal from 'components/AddToPlaylistModal';
import usePlaylist from 'hooks/usePlaylist';
import useContentDetails from 'hooks/useContentDetails';

const User = () => {
  const user = getAuthTokenPayload();
  const { t } = useTranslation();
  // console.log(profile);
  const [playlist, setPlaylist] = useState(null);
  const [detailedPlaylists, setDetailedPlaylists] = useState<any[]>([]);
  const [transformedPlaylists, setTransformedPlaylists] = useState<any[]>([]);
  const { fetchContentDetails } = useContentDetails();
  const [playlistData, setPlaylistData] = useState<[]>([]);
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
    deletePlaylist: handleDeletePlaylist
  } = usePlaylist('', userId);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tab = queryParams.get('tab');

  const { isLoggedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);

  const [selectedPanel, setSelectedPanel] = useState(tab || 'content');
  const navigate = useNavigate();

  function handleClose() {
    setIsPlaylistModalOpen(false);
  }

  const openPlaylistModal = () => {
    setIsPlaylistModalOpen(true);
  };

  const createPlaylist = async () => {
    const newPlaylistt = {
      title: 'Playlist of dreams and testing',
      description: 'lorem ipsum dolor sit amet and all that jazz',
      profileId: '',
      userId: '4ce80f0b-48d1-45db-92f3-587485480409',
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
      <Grid container>
        <Grid xs={10} xsOffset={1} md={7}>
          {playlists && (
            <PlaylistPanel
              playlists={playlists?.data || []}
              test={detailedPlaylists}
              profileId={''}
              userId={userId}
            />
          )}
        </Grid>
      </Grid>

      <AddToPlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={handleClose}
        profileId={''}
        userId={userId}
        onlyCreate
      />

      <Footer />
    </Box>
  );
};

export default User;
