import { Box } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import { useEffect, useState } from 'react';
import PlaylistPanel from 'components/PlaylistPanel';
import { useParams } from 'react-router-dom';
import useSinglePlaylist from 'hooks/useSinglePlaylist';
import Lottie from 'lottie-react';
import LoadingCubes from 'assets/animations/loading-cubes.json';

const EmbeddedPlaylist = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const { playlist, isLoading, handleGetPlaylist, refetchPlaylist } =
    useSinglePlaylist(playlistId || '');

  const [isDomainAllowed, setIsDomainAllowed] = useState(true);

  // @ts-ignore
  const embedPlaylistWhitelist = playlist?.data[0].data.embedPlaylistWhitelist;

  useEffect(() => {
    if (!isLoading && embedPlaylistWhitelist.length > 0) {
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

  return isDomainAllowed && playlist ? (
    <Grid container>
      <Grid xs={10} xsOffset={1} md={8}>
        {playlist ? (
          <div>
            <PlaylistPanel
              profileId={''}
              userId={''}
              playlists={playlist?.data}
              cameFromSinglePlaylist={true}
              refetchPlaylist={refetchPlaylist}
              currentPlaylistId={playlistId}
            />
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
  ) : (
    <Box>
      <h1>This playlist is not allowed to be embedded.</h1>
    </Box>
  );
};

export default EmbeddedPlaylist;
