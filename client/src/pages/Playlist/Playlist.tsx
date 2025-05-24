/**
 * The `Playlist` component (page) is designed to display a playlist and its associated content
 * when anyone (logged in or not) navigates to a playlist on the site.
 * It fetches playlist details and the user's profile information upon component mounting. The component renders an `EmbedModal`
 * for sharing the playlist and dynamically generates a link to the playlist creator's profile if the current user's profile
 * does not match the playlist creator's profile. The component conditionally displays the creator's profile link based on the
 * availability of the localProfile` and `playlistCreatorProfileId`, and whether the current profile matches the playlist creator's profile.
 *
 */

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
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';

const Playlist = () => {
  const navigate = useNavigate();
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
            <s.ViewSection>
              <s.Header>
            <Link
               to={`/profile/${localProfile.tag}`}
              style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                color: 'inherit',
                textDecoration: 'none'
              }}
              aria-label={`${localProfile.organization}'s profile - @${localProfile.tag}`}
            >
            
            
                  <s.ImageWrapper>
                   <s.ImageInner>
                      {localProfile.logoUrl && (
                        <img
                          src={localProfile!.logoUrl}
                          aria-hidden="true"
                          alt=""
                        />
                      )}
                    </s.ImageInner>
                  </s.ImageWrapper>

                <div>
                  <Typography
                    component="h5"
                    variant="h5"
                    sx={{ marginBottom: '4px' }}
                  >
                    {localProfile!.organization || ''}

                    </Typography>
                    <Typography
                      component="span"
                      sx={{ 
                        display: 'block',
                        position: 'relative',
                        fontSize: '0.875rem',
                        opacity: 0.7
                      }}
                    >
                      {localProfile &&
                        localProfile.tag &&
                        localProfile!.tag &&
                        (localProfile!.tag.includes('@')
                          ? localProfile!.tag
                          : `@${localProfile!.tag}`)}
                    
                  </Typography>
                  </div>
                </Link>
                </s.Header>
              </s.ViewSection>
       
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
                <s.ActionsWrapper
                  tabIndex={0}
                  onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                    if (e.key === 'Enter') {
                      openEmbedModal();
                    }
                  }}
                >
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
