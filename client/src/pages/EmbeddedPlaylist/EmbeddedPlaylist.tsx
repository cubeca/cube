import { Box } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import { useEffect, useState } from 'react';
import PlaylistPanel from 'components/PlaylistPanel';
import { useParams } from 'react-router-dom';
import useSinglePlaylist from 'hooks/useSinglePlaylist';
import { getAuthTokenPayload } from 'utils/auth';

const EmbeddedPlaylist = () => {
  const { id } = useParams<{ id: string }>();
  const user = getAuthTokenPayload();
  const { playlist, isLoading, handleGetPlaylist, refetchPlaylist } =
    useSinglePlaylist(id || '');
  const [userId, setUserId] = useState('');

  const [isDomainAllowed, setIsDomainAllowed] = useState(true);

  // @ts-ignore
  const embedPlaylistWhitelist = playlist?.data[0].data.embedPlaylistWhitelist;

  useEffect(() => {
    if (!isLoading && embedPlaylistWhitelist) {
      setIsDomainAllowed(false);

      const handleParentMessage = (event: { origin: string }) => {
        checkIsDomainAllowed(event.origin);
      };

      window.addEventListener('message', handleParentMessage);

      return () => {
        window.removeEventListener('message', handleParentMessage);
      };
    }
  }, [isLoading, embedPlaylistWhitelist]);

  function checkIsDomainAllowed(domain: string) {
    if (
      embedPlaylistWhitelist === undefined ||
      embedPlaylistWhitelist.length === 0
    ) {
      setIsDomainAllowed(true);
    }

    const normalizedInputUrl = domain
      .replace(/(^\w+:|^)\/\//, '')
      .toLowerCase();

    const checkEmbedWhitelist = (embedPlaylistWhitelist ?? []).some(
      (domain: string) => {
        const normalizedDomain = domain
          .replace(/(^\w+:|^)\/\//, '')
          .toLowerCase();

        return (
          normalizedInputUrl === normalizedDomain ||
          normalizedInputUrl === `www.${normalizedDomain}`
        );
      }
    );

    setIsDomainAllowed(checkEmbedWhitelist);
  }

  useEffect(() => {
    handleGetPlaylist();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      setUserId((user as any).sub);
    };
    fetchUser();
  }, [user]);

  return isDomainAllowed && playlist ? (
    <Grid container>
      <Grid xs={10} xsOffset={1} md={8}>
        <div>
          <PlaylistPanel
            profileId={''}
            userId={userId}
            playlists={playlist?.data}
            cameFromSinglePlaylist={true}
            refetchPlaylist={refetchPlaylist}
            currentPlaylistId={id}
          />
        </div>
      </Grid>
    </Grid>
  ) : (
    <Box>
      <h1>This playlist is not allowed to be embedded.</h1>
    </Box>
  );
};

export default EmbeddedPlaylist;
