import { Box } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import { useEffect, useState } from 'react';
import PlaylistPanel from 'components/PlaylistPanel';
import { useParams } from 'react-router-dom';
import useSinglePlaylist from 'hooks/useSinglePlaylist';
import { getAuthTokenPayload } from 'utils/auth';

const EmbeddedPlaylist = () => {
  const user = getAuthTokenPayload();
  const { id } = useParams<{ id: string }>();
  const { playlist, isLoading, handleGetPlaylist, refetchPlaylist } =
    useSinglePlaylist(id || '');
  const [userId, setUserId] = useState('');
  const [isDomainAllowed, setIsDomainAllowed] = useState(true);

  // @ts-ignore
  const embedPlaylistWhitelist = playlist?.data[0].data.embedPlaylistWhitelist;

  useEffect(() => {
    console.log('i am here', embedPlaylistWhitelist);
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
  }, [playlist, isLoading, embedPlaylistWhitelist]);

  function checkIsDomainAllowed(domain: string) {
    if (
      embedPlaylistWhitelist === undefined ||
      embedPlaylistWhitelist.length === 0
    ) {
      setIsDomainAllowed(true);
    }

    console.log(domain, embedPlaylistWhitelist);

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
    const fetchUser = async () => {
      const user = getAuthTokenPayload();
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
        {isDomainAllowed && playlist ? (
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
        ) : (
          <Box>
            <h1>This playlist is not allowed to be embedded.</h1>
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default EmbeddedPlaylist;
