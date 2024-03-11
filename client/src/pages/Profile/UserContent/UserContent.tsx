import ContentCard from 'components/ContentCard';
import UserContentFilter from './UserContentFilter';
import Lottie from 'lottie-react';
import LoadingCubes from 'assets/animations/loading-cubes.json';
import * as s from './UserContent.styled';
import { useCallback, useEffect, useState, useRef } from 'react';
import { SearchFilters } from '@cubeca/cube-svc-client-oas-axios';
import useDebounce from '../../../hooks/useDebounce';
import { useTranslation } from 'react-i18next';
import { searchContent, searchPlaylists } from 'api/search';
import Grid from '@mui/system/Unstable_Grid';
import { Typography } from '@mui/material';

interface UserContentProps {
  profile?: any;
}

const UserContent = ({ profile }: UserContentProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState();
  const [searchContentResults, setSearchContentResults] = useState(
    profile.content
  );
  const [searchPlaylistResults, setSearchPlaylistResults] = useState(
    profile.playlists
  );
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
    useState<boolean>(true);
  const [hasMorePlaylistsToLoad, setHasMorePlaylistsToLoad] =
    useState<boolean>(true);
  const isInitialMount = useRef(true);

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
          setSearchPlaylistResults(playlistResults);
        } else {
          setSearchPlaylistResults((prevPlaylistResults: any) => [
            ...prevPlaylistResults,
            ...playlistResults
          ]);
        }

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

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      fetchContent(0);
    }
  }, [fetchContent, debouncedSearchTerm]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      fetchPlaylist(0);
    }
  }, [fetchPlaylist, debouncedSearchTerm]);

  const handleLoadMoreContent = () => {
    fetchContent(contentOffset);
  };

  const handleLoadMorePlaylist = () => {
    fetchPlaylist(playlistOffset);
  };

  const displayContent =
    searchTerm.trim() !== '' || categoryFilter
      ? searchContentResults
      : profile.content;

  const displayPlaylists =
    searchTerm.trim() !== '' || categoryFilter
      ? searchPlaylistResults
      : profile.playlists;

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
                debouncedSearchTerm !== '' &&
                searchPlaylistResults.length === 0 && (
                  <Grid>
                    <Typography component="p" variant="body1" mt={2}>
                      <span>No playlists found</span>
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

            {!isPlaylistLoading &&
              hasMorePlaylistsToLoad &&
              debouncedSearchTerm.trim() !== '' && (
                <s.LoadMore onClick={handleLoadMorePlaylist}>
                  <span className="inner">
                    <span className="label">{t('Load More Results')}</span>
                  </span>
                </s.LoadMore>
              )}
          </s.UserContent>
        </>
      )}

      {categoryFilter !== 'playlist' && (
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
            {!isContentLoading &&
              debouncedSearchTerm.trim() !== '' &&
              hasMoreContentToLoad && (
                <s.LoadMore onClick={handleLoadMoreContent}>
                  <span className="inner">
                    <span className="label">{t('Load More Results')}</span>
                  </span>
                </s.LoadMore>
              )}
          </s.UserContent>
        </>
      )}
    </s.UserContentWrapper>
  );
};

export default UserContent;
