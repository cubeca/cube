import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ContentList from 'components/ContentList';
import { ContentLoader } from 'components/Loaders';
import { PropsWithChildren, useEffect, useState } from 'react';
import useProfileContent from 'hooks/useProfileContent';
import useSinglePlaylist from 'hooks/useSinglePlaylist';

interface MoreContentProps {
  profileId: string;
  excludeId: string;
  playlistId?: any;
}

const MoreContent = ({
  profileId,
  excludeId,
  playlistId
}: PropsWithChildren<MoreContentProps>) => {
  const [moreContent, setMoreContent] = useState<any>([]);
  const [allContent, setAllContent] = useState<any>([]);
  const [randomContent, setRandomContent] = useState([]);
  const [playlistData, setPlaylistData] = useState<any>([]);
  const { t } = useTranslation();
  const { data: content, isLoading } = useProfileContent(profileId);

  function getRandomContent(content: any[], count: number) {
    const shuffled = content.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  const { playlist, handleGetPlaylist, isSuccess } = useSinglePlaylist(
    playlistId ? playlistId : ''
  );

  useEffect(() => {
    handleGetPlaylist();
  }, []);

  useEffect(() => {
    if (playlist) {
      setPlaylistData(playlist.data);
    }
  }, [playlist]);

  useEffect(() => {
    if (content) {
      const filteredContent = (content as unknown as Array<any>).filter(
        (c: any) => c.id !== excludeId
      );
      setAllContent(filteredContent);
    }
  }, [content, excludeId]);

  // this feature is on hold while i rethink
  // useEffect(() => {
  //   if (isSuccess && playlistData[0].contentItems) {
  //     // setAllContent(playlistData[0].contentItems);
  //     setRandomContent(playlistData[0].contentItems);
  //     console.log(allContent, 'allContent');
  //   } else {
  //     setMoreContent(allContent);
  //     console.log(allContent, 'allContent');
  //     setRandomContent(getRandomContent(allContent, 5) as never[]);
  //   }
  // }, [allContent, playlistData]);

  useEffect(() => {
    setMoreContent(allContent);
    setRandomContent(getRandomContent(allContent, 3) as never[]);
  }, [allContent]);

  return (
    <Stack>
      {!isLoading && (moreContent.length > 0 || playlistData) ? (
        <ContentList
          heading={t('More Content Like This')}
          content={randomContent}
        />
      ) : (
        <Stack direction="column" spacing={2}>
          <ContentLoader size={1} />
        </Stack>
      )}
    </Stack>
  );
};

export default MoreContent;
