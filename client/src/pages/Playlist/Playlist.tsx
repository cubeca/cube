import { Box, Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import { useEffect, useState } from 'react';
import PlaylistPanel from 'components/PlaylistPanel';
import useProfile from 'hooks/useProfile';
import { useParams } from 'react-router-dom';
import useSinglePlaylist from 'hooks/useSinglePlaylist';
import LoadingCubes from 'assets/animations/loading-cubes.json';
import { getAuthTokenPayload } from 'utils/auth';
import { getProfile } from 'api/profile';
import CodeIcon from '@mui/icons-material/Code';
import EmbedModal from 'components/EmbedPlaylistModal/EmbedPlaylistModal';
import * as s from './Playlist.styled';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';

const Playlist = () => {
  const user = getAuthTokenPayload();
  const { id } = useParams<{ id: string }>();
  const { playlist, handleGetPlaylist, refetchPlaylist, isLoading } =
    useSinglePlaylist(id || '');
  const [userId, setUserId] = useState('');
  const [profileId, setProfileId] = useState('');
  const [localProfile, setLocalProfile] = useState<any>();
  const [localPlaylist, setLocalPlaylist] = useState<any>();
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState(false);

  // @ts-ignore
  const embedPlaylistWhitelist = playlist?.data[0].data.embedPlaylistWhitelist;
  // @ts-ignore
  const playlistCreatorUserId = playlist?.data[0].data.userId;
  // @ts-ignore
  const embedToggleEnabled = playlist?.data[0].data.embedToggleEnabled;
  // @ts-ignore
  const playlistCreatorProfileId = playlist?.data[0].data.profileId;

  const { data: profile } = useProfile();

  function handleClose() {
    setIsEmbedModalOpen(false);
  }

  useEffect(() => {
    if (userId === playlistCreatorUserId) {
      setShowEmbedModal(true);
      return;
    }

    if (
      (embedPlaylistWhitelist &&
        embedPlaylistWhitelist.length > 0 &&
        !(
          embedPlaylistWhitelist.length === 1 &&
          embedPlaylistWhitelist[0] === ''
        )) ||
      (!embedToggleEnabled && embedToggleEnabled !== undefined)
    ) {
      setShowEmbedModal(false);
    } else {
      setShowEmbedModal(true);
    }
  }, [embedPlaylistWhitelist]);

  const openEmbedModal = () => {
    setIsEmbedModalOpen(true);
  };
  useEffect(() => {
    if (playlist) {
      setLocalPlaylist(playlist.data);
    }
  }, [profile, playlist]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (profileId || playlistCreatorProfileId) {
        const fetchedProfile = await getProfile(
          playlistCreatorProfileId ? playlistCreatorProfileId : profileId
        );
        setLocalProfile(fetchedProfile.data);
        console.log(fetchedProfile.data, 'fetchedProfile');
      }
    };

    fetchProfile();
  }, [profileId, playlistCreatorProfileId]);

  useEffect(() => {
    if (localPlaylist) {
      setProfileId(localPlaylist[0].data.profileId);
    }
  }, [localPlaylist]);

  useEffect(() => {
    setProfileId(profile?.profileId || '');
  }, [localProfile]);

  useEffect(() => {
    const fetchUser = async () => {
      const user = getAuthTokenPayload();
      setUserId((user as any).sub);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    handleGetPlaylist();
  }, []);

  return (
    <Grid container>
      <EmbedModal isOpen={isEmbedModalOpen} onClose={handleClose} />
      <Grid xs={10} xsOffset={1} md={8}>
        {localProfile &&
          !isLoading &&
          profileId !== playlistCreatorProfileId &&
          (!profile.profileId || playlistCreatorProfileId !== '') && (
            <Link
              to={`/profile/${localProfile.tag}`}
              style={{ color: 'inherit' }}
            >
              <s.ViewSection>
                <s.Header>
                  <s.ImageWrapper>
                    <s.ImageInner
                      title={localProfile!.organization}
                      target="_blank"
                      style={{ cursor: 'pointer' }}
                    >
                      {localProfile.logoUrl && (
                        <img
                          src={localProfile!.logoUrl}
                          alt="user profile thumbnail"
                        />
                      )}
                    </s.ImageInner>
                  </s.ImageWrapper>

                  <Typography component="h5" variant="h5">
                    {localProfile!.organization || ''}

                    <small>
                      {localProfile &&
                        localProfile.tag &&
                        localProfile!.tag &&
                        (localProfile!.tag.includes('@')
                          ? localProfile!.tag
                          : `@${localProfile!.tag}`)}
                    </small>
                  </Typography>
                </s.Header>
              </s.ViewSection>
            </Link>
          )}
        {playlist ? (
          <div>
            <PlaylistPanel
              profileId={profileId}
              userId={userId}
              playlists={playlist?.data}
              cameFromSinglePlaylist={true}
              refetchPlaylist={refetchPlaylist}
              currentPlaylistId={id}
            />
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >
              {showEmbedModal && (
                <s.ActionsWrapper>
                  <CodeIcon />
                  <s.Action to={''} onClick={openEmbedModal}>
                    Embed
                  </s.Action>
                </s.ActionsWrapper>
              )}
            </Box>
          </div>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Lottie
              animationData={LoadingCubes}
              loop
              autoplay
              style={{ height: '500px', width: '500px' }}
            />
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default Playlist;
