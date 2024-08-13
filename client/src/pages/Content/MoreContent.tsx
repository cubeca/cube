/**
 * `MoreContent` fetches and displays additional content related to the current content or playlist.
 * It uses custom hooks `useProfileContent` and `useSinglePlaylist` to fetch content based on the profile ID or playlist ID provided.
 * The component can also filter out specific content by an exclude ID and can further refine content fetching based on tags.
 * It renders a list of content or playlists using `ContentList` or `ContentListPlaylists` components respectively.
 * If the data is still loading, a `ContentLoader` is displayed to indicate the loading state.
 *
 * @param {string} profileId The ID of the profile for which to fetch related content.
 * @param {string} excludeId The ID of the content to exclude from the results.
 * @param {string} [playlistId] Optional. The ID of the playlist for which to fetch related playlists.
 * @param {any} [tags] Optional. Tags used to further filter the content or playlists.
 */

import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ContentList from 'components/ContentList';
import { ContentLoader } from 'components/Loaders';
import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import useProfileContent from 'hooks/useProfileContent';
import useSinglePlaylist from 'hooks/useSinglePlaylist';
import { searchContent, searchPlaylists } from 'api/search';
import { SearchFilters } from '@cubeca/cube-svc-client-oas-axios';
import ContentListPlaylists from 'components/ContentListPlaylists';
import FPOThumb1 from '../../assets/images/fpo/cont-art-gal-thumb1.png';
import FPOThumb2 from '../../assets/images/fpo/daniels-joffe-PhQ4CpXLEX4-unsplash-thumb.png';
import FPOThumb3 from '../../assets/images/fpo/pawel-czerwinski-Kd_IiyO7IqQ-unsplash-thumb.png';
import FPOThumb4 from '../../assets/images/fpo/third-top-thumb.png';
import FPOThumb5 from '../../assets/images/fpo/first-bottom-thumb.png';
import FPOThumb6 from '../../assets/images/fpo/third-bottom-thumb.png';

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

  const { t } = useTranslation('common');
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

  // fallback content to display if no content is found
  const defaultContent = [
    {
      id: '4f0b89ba-9104-4806-91c4-a86cb71a2751',
      coverImageUrl: {
        playerInfo: {
          publicUrl: FPOThumb1
        }
      },
      title: 'Alex Morrison, Nooks and Corners',
      url: 'https://cubecommons.ca/content/4f0b89ba-9104-4806-91c4-a86cb71a2751',
      type: 'video',
      hasSignLanguage: false
    },
    {
      id: '9dc02c2f-6d9c-485b-971d-818f23b3267b',
      coverImageUrl: {
        playerInfo: {
          publicUrl: FPOThumb2
        }
      },
      title: 'Faye HeavyShield, CAG (French)',
      url: 'https://cubecommons.ca/content/9dc02c2f-6d9c-485b-971d-818f23b3267b',
      type: 'video',
      hasSignLanguage: false
    },
    {
      id: 'bc3610ab-9bf6-4283-81a9-ce1287a45570',
      coverImageUrl: {
        playerInfo: {
          publicUrl: FPOThumb4
        }
      },
      title:
        'XICANX Dreamers + Changemakers / Soñadores + creadores del cambio',
      url: 'https://www.cubecommons.ca/content/bc3610ab-9bf6-4283-81a9-ce1287a45570',
      type: 'video',
      hasSignLanguage: false
    },
    {
      id: '642afc53-60f2-4eb7-89eb-459b8d6ce0be',
      coverImageUrl: {
        playerInfo: {
          publicUrl: FPOThumb3
        }
      },
      title: 'Faye HeavyShield, CAG (English)',
      url: 'https://cubecommons.ca/content/642afc53-60f2-4eb7-89eb-459b8d6ce0be',
      type: 'audio',
      hasSignLanguage: false
    },
    {
      id: '3f15f034-b952-4101-a64a-79b9d0dda987',
      coverImageUrl: {
        playerInfo: {
          publicUrl: FPOThumb5
        }
      },
      title:
        'XICANX Dreamers + Changemakers / Soñadores + creadores del cambio',
      url: 'https://www.cubecommons.ca/content/3f15f034-b952-4101-a64a-79b9d0dda987',
      type: 'audio',
      hasSignLanguage: false
    },
    {
      id: '79cf81ff-b033-40d9-84a9-e371c15945c3',
      coverImageUrl: {
        playerInfo: {
          publicUrl: FPOThumb6
        }
      },
      title: 'How to feel unsafe in a safe way',
      url: 'https://www.cubecommons.ca/content/79cf81ff-b033-40d9-84a9-e371c15945c3',
      type: 'video'
    }
  ];

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
    if (firstFiveUniqueContent.length === 0) {
      setUniqueCombinedContent(defaultContent);
    }
  }, [combinedContent]);

  return (
    <Stack>
      {combinedContent.length > 0 ? (
        <ContentList
          heading={t('Play Page Header 4')}
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
