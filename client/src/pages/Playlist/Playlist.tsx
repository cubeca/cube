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
import * as s from './Playlist.styled';
import { Link } from 'react-router-dom';

const Playlist = () => {
  const user = getAuthTokenPayload();
  const { id } = useParams<{ id: string }>();
  const { playlist, handleGetPlaylist } = useSinglePlaylist(id || '');
  const [userId, setUserId] = useState('');
  const [profileId, setProfileId] = useState('');
  const [profile, setProfile] = useState<any>();
  const [localPlaylist, setLocalPlaylist] = useState<any>();
  const playlists: never[] = [];

  useEffect(() => {
    if (playlist) {
      setLocalPlaylist(playlist.data);
    }
  }, [profile, playlist]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (profileId) {
        const fetchedProfile = await getProfile(profileId);
        console.log(fetchedProfile, 'fetchedProfile');
        setProfile(fetchedProfile.data);
      }
    };

    fetchProfile();
  }, [profileId]);

  useEffect(() => {
    if (localPlaylist) {
      setProfileId(localPlaylist[0].data.profileId);
    }
  }, [localPlaylist]);

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
            />
          </div>
        ) : (
          'Loading...'
        )}
      </Grid>
    </Grid>
  );
};

export default Playlist;
