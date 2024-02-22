import { Box, Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import PlaylistPanel from 'components/PlaylistPanel';
import useProfile from 'hooks/useProfile';
import { useParams } from 'react-router-dom';
import useSinglePlaylist from 'hooks/useSinglePlaylist';
import { GetPlaylistResponse } from '@cubeca/cube-svc-client-oas-axios';
import { getAuthTokenPayload } from 'utils/auth';
import useProfileContent from 'hooks/useProfileContent';
import { GetProfileResponseData } from '@cubeca/cube-svc-client-oas-axios';
import { getProfile } from 'api/profile';
import CodeIcon from '@mui/icons-material/Code';
import EmbedModal from 'components/EmbedModal';
import * as s from './Playlist.styled';
import { Link } from 'react-router-dom';

const Playlist = () => {
  const user = getAuthTokenPayload();
  const { id } = useParams<{ id: string }>();
  const { playlist, handleGetPlaylist } = useSinglePlaylist(id || '');
  const [userId, setUserId] = useState('');
  const [profileId, setProfileId] = useState('');
  const [localProfile, setLocalProfile] = useState<any>();
  const [localPlaylist, setLocalPlaylist] = useState<any>();
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const playlists: never[] = [];
  const embedContentWhitelist: unknown = [];

  const { data: profile, isLoading, refetch } = useProfile();

  function handleClose() {
    setIsEmbedModalOpen(false);
  }

  useEffect(() => {
    if (
      embedContentWhitelist === undefined ||
      (embedContentWhitelist as any[])?.length === 0
    ) {
      setShowEmbedModal(true);
    } else {
      setShowEmbedModal(false);
    }
  }, [embedContentWhitelist]);
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
      if (profileId) {
        const fetchedProfile = await getProfile(profileId);
        setLocalProfile(fetchedProfile.data);
      }
    };

    fetchProfile();
  }, [profileId]);

  useEffect(() => {
    if (localPlaylist && profileId) {
      setProfileId(localPlaylist[0].data.profileId);
    }
  }, [localPlaylist]);

  useEffect(() => {
    setProfileId(profile?.profileId || '');
  }, [localProfile]);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getAuthTokenPayload();
      setUserId((user as any).sub);
    };
    fetchUser();
  }, [user]);

  useEffect(() => {
    handleGetPlaylist();
  }, []);

  return (
    <Grid container>
      <EmbedModal
        isOpen={isEmbedModalOpen}
        onClose={handleClose}
        embedContentType={'playlist'}
      />
      <Grid xs={10} xsOffset={1} md={8}>
        {profile && (
          <Link to={`/profile/${profile.tag}`} style={{ color: 'inherit' }}>
            <s.ViewSection>
              <s.Header>
                <s.ImageWrapper>
                  <s.ImageInner
                    title={profile!.organization}
                    target="_blank"
                    style={{ cursor: 'pointer' }}
                  >
                    {profile.logoUrl && (
                      <img
                        src={profile!.logoUrl}
                        alt="user profile thumbnail"
                      />
                    )}
                  </s.ImageInner>
                </s.ImageWrapper>

                <Typography component="h5" variant="h5">
                  {profile!.organization || ''}

                  <small>
                    {profile!.tag &&
                      (profile!.tag.includes('@')
                        ? profile!.tag
                        : `@${profile!.tag}`)}
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
          'Loading...'
        )}
      </Grid>
    </Grid>
  );
};

export default Playlist;