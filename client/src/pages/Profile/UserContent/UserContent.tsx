import ContentCard from 'components/ContentCard';
import UserContentFilter from './UserContentFilter';
import Lottie from 'lottie-react';
import LoadingCubes from 'assets/animations/loading-cubes.json';
import * as s from './UserContent.styled';
import { useCallback, useEffect, useState, useRef } from 'react';
import {
  ContentStorage,
  PlaylistStorage,
  SearchFilters
} from '@cubeca/cube-svc-client-oas-axios';
import useDebounce from '../../../hooks/useDebounce';
import { useTranslation } from 'react-i18next';
import { searchContent, searchPlaylists } from 'api/search';
import Grid from '@mui/system/Unstable_Grid';
import { Typography } from '@mui/material';
import { display } from '@mui/system';

interface UserContentProps {
  profile?: any;
}

const UserContent = ({ profile }: UserContentProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState();
  const [displayContent, setDisplayContent] = useState<ContentStorage[]>([]);
  const [displayPlaylists, setDisplayPlaylists] = useState<PlaylistStorage[]>(
    []
  );

  const [searchContentResults, setSearchContentResults] = useState<
    ContentStorage[]
  >([]);

  const [isContentLoading, setIsContentLoading] = useState<boolean>(false);
  const [isPlaylistLoading, setIsPlaylistLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [contentOffset, setContentOffset] = useState<number>(0);
  const [playlistOffset, setPlaylistOffset] = useState<number>(0);
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const { t } = useTranslation();
  const [contentLimit, setContentLimit] = useState<number>(12);
  const [playlistLimit, setPlaylistLimit] = useState<number>(4);
  const [hasMoreContentToLoad, setHasMoreContentToLoad] =
    useState<boolean>(false);
  const [hasMorePlaylistsToLoad, setHasMorePlaylistsToLoad] =
    useState<boolean>(false);

  useEffect(() => {
    setIsPlaylistLoading(true);
    setIsContentLoading(true);
    if (profile.id) {
      setDisplayContent(profile.content);
      setDisplayPlaylists(profile.playlists);

      setIsPlaylistLoading(false);
      setIsContentLoading(false);
    }
  }, [profile]);

  const fetchContent = useCallback(
    async (newContentOffset: number) => {
      setIsContentLoading(true);
      try {
        const searchFilters: SearchFilters = {
          category: categoryFilter === 'all' ? undefined : categoryFilter,
          profileId: profile?.id
        };

        const results = await searchContent(
          debouncedSearchTerm.trim(),
          newContentOffset,
          contentLimit,
          searchFilters
        );

        const newResults = Array.isArray(results) ? results : [];
        if (newResults.length <= 12) {
          setHasMoreContentToLoad(false);
        }

        if (newContentOffset === 0) {
          setSearchContentResults(newResults);
        } else {
          setSearchContentResults((prevResults: any) => [
            ...prevResults,
            ...newResults
          ]);
        }

        setContentOffset(newContentOffset + contentLimit);
      } catch (error) {
        console.error('An error occurred during the search:', error);
        setError('Failed to load search results');
      } finally {
        setIsContentLoading(false);
      }
    },
    [debouncedSearchTerm, categoryFilter]
  );

  const fetchPlaylist = useCallback(
    async (newPlaylistOffset: number) => {
      console.log('calling detch playlist', newPlaylistOffset);
      setIsPlaylistLoading(true);

      const searchFilters: SearchFilters = {
        profileId: profile?.id
      };

      try {
        const playlistResults = await searchPlaylists(
          debouncedSearchTerm.trim(),
          newPlaylistOffset,
          newPlaylistOffset === 0 ? 3 : playlistLimit,
          searchFilters
        );

        if (newPlaylistOffset === 0) {
          setDisplayPlaylists(playlistResults);
        } else {
          setDisplayPlaylists((prevPlaylistResults: any) => [
            ...prevPlaylistResults,
            ...playlistResults
          ]);
        }

        console.log('playlistResults', playlistResults);

        if (playlistResults.length === 0) {
          setHasMorePlaylistsToLoad(false);
        } else {
          setHasMorePlaylistsToLoad(true);
        }

        setPlaylistOffset(
          newPlaylistOffset + (newPlaylistOffset === 0 ? 3 : playlistLimit)
        );
      } catch (error) {
        setError('Failed to load search results');
      } finally {
        setIsPlaylistLoading(false);
      }
    },
    [debouncedSearchTerm, categoryFilter]
  );

  // useEffect(() => {
  //   if (isInitialMount.current) {
  //     isInitialMount.current = false;
  //   } else {
  //     fetchContent(0);
  //   }
  // }, [fetchContent, debouncedSearchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm.trim() !== '') {
      fetchPlaylist(0);
    } else {
      setDisplayPlaylists(profile.playlists);
    }
  }, [debouncedSearchTerm, categoryFilter]);

  // useEffect(() => {
  //   if (searchTerm.trim() === '' && categoryFilter === 'all') {
  //     setSearchContentResults(profile.content);
  //     setSearchPlaylistResults(profile.playlists);
  //   }
  // }, [debouncedSearchTerm, categoryFilter]);

  const handleLoadMoreContent = () => {
    fetchContent(contentOffset);
  };

  const handleLoadMorePlaylist = () => {
    fetchPlaylist(playlistOffset);
  };

  return (
    <s.UserContentWrapper>
      <UserContentFilter
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />

      {(categoryFilter === 'all' ||
        categoryFilter === 'playlist' ||
        categoryFilter === undefined) && (
        <>
          <s.ContentHeader container>
            <Grid>
              <Typography component="h3" variant="h3">
                <span>Playlists</span>
              </Typography>
              {!isPlaylistLoading &&
                displayPlaylists &&
                displayPlaylists.length === 0 && (
                  <Grid>
                    <Typography component="p" variant="body1" mt={2}>
                      <span>No playlists to display</span>
                    </Typography>
                  </Grid>
                )}
            </Grid>
          </s.ContentHeader>

          <s.UserContent>
            {isPlaylistLoading ? (
              <Lottie
                className="loading-cubes"
                animationData={LoadingCubes}
                loop={true}
              />
            ) : error ? (
              <p>{error}</p>
            ) : (
              !isPlaylistLoading &&
              displayPlaylists &&
              displayPlaylists.length > 0 &&
              displayPlaylists?.map((key: any) => (
                <ContentCard
                  key={key.id}
                  image={key.coverImageUrl?.playerInfo?.publicUrl || ''}
                  title={key.title}
                  url={`/playlist/${key.id}`}
                  icon={'playlist'}
                />
              ))
            )}

            {!isPlaylistLoading && hasMorePlaylistsToLoad && (
              <s.LoadMore onClick={handleLoadMorePlaylist}>
                <span className="inner">
                  <span className="label">{t('Load More Results')}</span>
                </span>
              </s.LoadMore>
            )}
          </s.UserContent>
        </>
      )}

      {/* {categoryFilter !== 'playlist' && (
        <>
          <s.ContentHeader container>
            <Grid mt={4}>
              <Typography component="h3" variant="h3">
                <span>Content</span>
              </Typography>
              {!isContentLoading &&
                debouncedSearchTerm !== '' &&
                searchContentResults.length === 0 && (
                  <Grid>
                    <Typography component="p" variant="body1" mt={2}>
                      <span>No content found</span>
                    </Typography>
                  </Grid>
                )}
            </Grid>
          </s.ContentHeader>
          <s.UserContent>
            {isContentLoading ? (
              <Lottie
                className="loading-cubes"
                animationData={LoadingCubes}
                loop={true}
              />
            ) : error ? (
              <p>{error}</p>
            ) : (
              displayContent?.map((item: any) => (
                <ContentCard
                  key={item.id}
                  image={
                    item.coverImageUrl?.playerInfo?.publicUrl ||
                    item.coverImageExternalUrl ||
                    ''
                  }
                  title={item.title}
                  url={`/content/${item.id}`}
                  icon={item.type}
                  hasSignLanguage={item.hasSignLanguage}
                  coverImageAltText={item.coverImageText}
                />
              ))
            )}
            {!isContentLoading && hasMoreContentToLoad && (
              <s.LoadMore onClick={handleLoadMoreContent}>
                <span className="inner">
                  <span className="label">{t('Load More Results')}</span>
                </span>
              </s.LoadMore>
            )}
          </s.UserContent>
        </>
      )} */}
    </s.UserContentWrapper>
  );
};

export default UserContent;
