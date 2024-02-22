import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ContentList from 'components/ContentList';
import { ContentLoader } from 'components/Loaders';
import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import useProfileContent from 'hooks/useProfileContent';
import useSinglePlaylist from 'hooks/useSinglePlaylist';
import { searchContent, searchPlaylists } from 'api/search';
import { SearchFilters } from '@cubeca/cube-svc-client-oas-axios';
import { set } from 'date-fns';
import ContentListPlaylists from 'components/ContentListPlaylists';

interface MoreContentProps {
  profileId: string;
  excludeId: string;
  playlistId?: any;
  tags?: any;
}

const MoreContent = ({
  profileId,
  excludeId,
  playlistId,
  tags
}: PropsWithChildren<MoreContentProps>) => {
  const [moreContent, setMoreContent] = useState<any>([]);
  const [profileContent, setProfileContent] = useState<any>([]);
  const [randomContent, setRandomContent] = useState([]);
  const [playlistData, setPlaylistData] = useState<any>([]);
  const [combinedContent, setCombinedContent] = useState<any>([]);
  const [uniqueCombinedContent, setUniqueCombinedContent] = useState<any>([]);
  const [combinedTags, setCombinedTags] = useState<any>('');
  const [tagContent, setTagContent] = useState<any>([]);
  const [playlistContent, setPlaylistContent] = useState<any>([]);
  const [isFromPlaylist, setIsFromPlaylist] = useState<boolean>(playlistId);

  const { t } = useTranslation();
  const { data: content, isLoading } = useProfileContent(profileId);

  function getRandomContent(content: any[], count: number) {
    const shuffled = content.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  const {
    playlist,
    handleGetPlaylist,
    isSuccess,
    isLoading: isPlaylistLoading
  } = useSinglePlaylist(playlistId ? playlistId : '');

  useEffect(() => {
    const tagsString = tags.length > 0 ? tags.join(', ') : '';
    setCombinedTags(tagsString);
  }, [tags]);

  const fetchContentByTags = useCallback(async () => {
    const tagsString = tags.length > 0 ? tags.join(', ') : '';
    try {
      const searchFilters: SearchFilters = {
        tags: tagsString
      };
      const results = await searchContent('', 0, 5, searchFilters);
      const newResults = Array.isArray(results) ? results : [];
      setTagContent(newResults);
    } catch (error) {
      console.error('An error occurred during the search:', error);
    }
  }, [tags]);

  const fetchPlaylistsByContentId = useCallback(async () => {
    try {
      const searchFilters: SearchFilters = {
        contentId: excludeId
      };
      const results = await searchPlaylists('', 0, 5, searchFilters);
      const newResults = Array.isArray(results) ? results : [];
      setPlaylistContent(newResults);
    } catch (error) {
      console.error('An error occurred during the search:', error);
    }
  }, [tags]);

  useEffect(() => {
    fetchContentByTags();
    setTagContent(getRandomContent(tagContent, 3) as never[]);
  }, [combinedTags]);

  useEffect(() => {
    fetchPlaylistsByContentId();
  }, [excludeId]);

  useEffect(() => {
    if (playlistId !== '') {
      handleGetPlaylist();
    }
  }, [playlistId]);

  useEffect(() => {
    if (playlist) {
      setPlaylistData(playlist.data);
    }
  }, [playlist]);

  // get profile content
  useEffect(() => {
    if (content) {
      const filteredContent = (content as unknown as Array<any>).filter(
        (c: any) => c.id !== excludeId
      );
      setProfileContent(getRandomContent(filteredContent, 3) as never[]);
    }
  }, [content, excludeId]);

  // combine all three content sources
  useEffect(() => {
    // get index of current content within playlist
    const currentContentIndex = playlistData[0]?.contentItems?.findIndex(
      (item: { id: string }) => item.id === excludeId
    );

    // get content after current content
    const contentItemsAfterCurrent =
      currentContentIndex >= 0
        ? playlistData[0]?.contentItems?.slice(currentContentIndex + 1)
        : [];
    const contentItemsBeforeCurrent =
      currentContentIndex >= 0
        ? playlistData[0]?.contentItems?.slice(0, currentContentIndex)
        : [];
    // if at the end of the playlist, start from the beginning ? or show random content ?
    if (isFromPlaylist && contentItemsAfterCurrent.length <= 0) {
      setCombinedContent([...profileContent, ...tagContent]);
    } else if (isFromPlaylist) {
      // if not at the end, show the remaining items
      setCombinedContent([...contentItemsAfterCurrent]);
    } else {
      // if not from playlist, show random content
      setCombinedContent([
        ...contentItemsAfterCurrent,
        ...tagContent,
        ...profileContent
      ]);
    }
  }, [playlistData, profileContent, tagContent]);

  // filter out any duplicates pulled in by grabbing content from multiple sources
  useEffect(() => {
    const uniqueCombinedContent = combinedContent
      .filter(
        (item: { id: any }, index: any, self: any[]) =>
          index === self.findIndex((t) => t.id === item.id)
      )
      .filter((item: { id: string }) => item.id !== excludeId); // filter the currently playing content

    const firstFiveUniqueContent = uniqueCombinedContent.slice(0, 5);
    setUniqueCombinedContent(firstFiveUniqueContent);
  }, [combinedContent]);

  return (
    <Stack>
      {combinedContent.length > 0 ? (
        <ContentList
          heading={t('More Content Like This')}
          content={uniqueCombinedContent}
          playlistId={playlistId}
        />
      ) : (
        <Stack direction="column" spacing={2}>
          <ContentLoader size={1} />
        </Stack>
      )}
      {playlistContent.length > 0 && (
        <ContentListPlaylists
          heading={t('Playlists with this content')}
          content={playlistContent}
        />
      )}
    </Stack>
  );
};

export default MoreContent;
