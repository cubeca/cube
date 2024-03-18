import ContentCard from 'components/ContentCard';
import UserContentFilter from './UserContentFilter';
import Lottie from 'lottie-react';
import LoadingCubes from 'assets/animations/loading-cubes.json';
import * as s from './UserContent.styled';
import { useCallback, useEffect, useRef, useState } from 'react';
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

interface UserContentProps {
  profile: any;
  isLoading: boolean;
}

const UserContent = ({ profile, isLoading }: UserContentProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState();
  const [contentResults, setContentResults] = useState<ContentStorage[]>([]);
  const [playlistResults, setPlaylistResults] = useState<PlaylistStorage[]>([]);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [isPlaylistLoading, setIsPlaylistLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 1000, '');
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const [contentOffset, setContentOffset] = useState<number>(0);
  const [playlistOffset, setPlaylistOffset] = useState<number>(0);
  const [contentLimit, setContentLimit] = useState<number>(12);
  const [playlistLimit, setPlaylistLimit] = useState<number>(3);
  const [hasMoreContentToLoad, setHasMoreContentToLoad] =
    useState<boolean>(true);
  const [hasMorePlaylistToLoad, setHasMorePlaylistsToLoad] =
    useState<boolean>(true);
  const isInitialMount = useRef(true);

  const fetchContentSearchResults = useCallback(
    async (newContentOffset: number) => {
      if (profile.id === undefined) return;
      setIsContentLoading(true);

      try {
        const searchFilters: SearchFilters = {
          category: categoryFilter === 'all' ? undefined : categoryFilter,
          profileId: profile.id
        };

        const contentResults = await searchContent(
          debouncedSearchTerm.trim(),
          newContentOffset,
          newContentOffset === 0 ? 8 : contentLimit,
          searchFilters
        );

        if (newContentOffset === 0) {
          setContentResults(contentResults);
        } else if (contentResults.length > 0) {
          setContentResults((prevContentResults) => [
            ...prevContentResults,
            ...contentResults
          ]);
        }

        if (contentResults.length < 8) {
          setHasMoreContentToLoad(false);
        } else {
          setHasMoreContentToLoad(true);
        }

        setContentOffset(
          newContentOffset + (newContentOffset === 0 ? 8 : contentLimit)
        );
      } catch (error) {
        setError('Failed to load search results');
      } finally {
        setIsContentLoading(false);
      }
    },
    [debouncedSearchTerm, categoryFilter, isLoading]
  );

  const fetchPlaylistSearchResults = useCallback(
    async (newPlaylistOffset: number) => {
      if (profile.id === undefined) return;
      setIsPlaylistLoading(true);

      const searchFilters: SearchFilters = {
        profileId: profile.id
      };

      try {
        const playlistResults = await searchPlaylists(
          debouncedSearchTerm.trim(),
          newPlaylistOffset,
          newPlaylistOffset === 0 ? 5 : playlistLimit,
          searchFilters
        );

        if (newPlaylistOffset === 0) {
          setPlaylistResults(playlistResults);
        } else {
          setPlaylistResults((prevPlaylistResults) => [
            ...prevPlaylistResults,
            ...playlistResults
          ]);
        }

        if (playlistResults.length < 3) {
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
    [debouncedSearchTerm, categoryFilter, isLoading]
  );

  const handleContentLoadMore = () => {
    fetchContentSearchResults(contentOffset);
  };

  const handlePlaylistLoadMore = () => {
    fetchPlaylistSearchResults(playlistOffset);
  };

  useEffect(() => {
    if (isInitialMount.current) {
      console.log('this is the initial mount');
      isInitialMount.current = false;
    } else {
      console.log('this is NOT initial mount');
      fetchPlaylistSearchResults(0);
    }
  }, [fetchPlaylistSearchResults, debouncedSearchTerm]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      fetchContentSearchResults(0);
    }
  }, [fetchContentSearchResults, debouncedSearchTerm]);

  return (
    <s.UserContentWrapper>
      {isLoading ? (
        <Lottie
          className="loading-cubes"
          animationData={LoadingCubes}
          loop={true}
          style={{ height: '500px' }}
        />
      ) : (
        <Grid container>
          <Grid xs={12} xsOffset={1}>
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
                    {!isPlaylistLoading && playlistResults.length === 0 && (
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
                    !isLoading &&
                    playlistResults?.map((key: any) => (
                      <ContentCard
                        key={key.id}
                        image={key.coverImageUrl?.playerInfo?.publicUrl || ''}
                        title={key.title}
                        url={`/playlist/${key.id}`}
                        icon={'playlist'}
                      />
                    ))
                  )}

                  {!isPlaylistLoading && hasMorePlaylistToLoad && (
                    <s.LoadMore onClick={handlePlaylistLoadMore}>
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
                  <Grid mt={8}>
                    <Typography component="h3" variant="h3">
                      <span>Content</span>
                    </Typography>
                    {!isContentLoading && contentResults.length === 0 && (
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
                    !isContentLoading &&
                    contentResults
                      ?.filter((key: any) => {
                        const expiryDate = new Date(key.expiry);
                        return expiryDate > new Date() || !key.expiry;
                      })
                      .map((key: any) => (
                        <ContentCard
                          key={key.id}
                          image={
                            key.coverImageUrl?.playerInfo?.publicUrl ||
                            key.coverImageExternalUrl ||
                            ''
                          }
                          title={key.title}
                          url={`/content/${key.id}`}
                          icon={key.type}
                          hasSignLanguage={key.hasSignLanguage}
                        />
                      ))
                  )}

                  {!isContentLoading && hasMoreContentToLoad && (
                    <s.LoadMore onClick={handleContentLoadMore}>
                      <span className="inner">
                        <span className="label">{t('Load More Results')}</span>
                      </span>
                    </s.LoadMore>
                  )}
                </s.UserContent>
              </>
            )}
          </Grid>
        </Grid>
      )}
    </s.UserContentWrapper>
  );
};

export default UserContent;
