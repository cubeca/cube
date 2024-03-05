import Grid from '@mui/system/Unstable_Grid';
import ContentCard from 'components/ContentCard';
import * as s from './CategorizedContent.styled';
import { useCallback, useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import ContentFilter from './CategorizedContentFilter';
import { searchContent, searchPlaylists } from 'api/search';
import {
  ContentStorage,
  PlaylistStorage,
  SearchFilters
} from '@cubeca/cube-svc-client-oas-axios';
import LoadingCubes from 'assets/animations/loading-cubes.json';
import useDebounce from '../../../../hooks/useDebounce';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';

const CategorizedContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState();
  const [contentResults, setContentResults] = useState<ContentStorage[]>([]);
  const [playlistResults, setPlaylistResults] = useState<PlaylistStorage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 1000, '');
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const [contentOffset, setContentOffset] = useState<number>(0);
  const [playlistOffset, setPlaylistOffset] = useState<number>(0);
  const [contentLimit, setContentLimit] = useState<number>(12);
  const [playlistLimit, setPlaylistLimit] = useState<number>(4);
  const [hasMoreContentToLoad, setHasMoreContentToLoad] =
    useState<boolean>(true);
  const [hasMorePlaylistToLoad, setHasMorePlaylistsToLoad] =
    useState<boolean>(true);

  const fetchSearchResults = useCallback(
    async (newContentOffset: number, newPlaylistOffset: number) => {
      setIsLoading(true);
      try {
        const searchFilters: SearchFilters = {
          category: categoryFilter === 'all' ? undefined : categoryFilter
        };

        const contentResults = await searchContent(
          debouncedSearchTerm.trim(),
          newContentOffset,
          newContentOffset === 0 ? 11 : contentLimit,
          searchFilters
        );

        const playlistResults = await searchPlaylists(
          debouncedSearchTerm.trim(),
          newPlaylistOffset,
          newPlaylistOffset === 0 ? 3 : playlistLimit
        );

        if (newContentOffset === 0) {
          setContentResults(contentResults);
        } else if (contentResults.length > 0) {
          setContentResults((prevContentResults) => [
            ...prevContentResults,
            ...contentResults
          ]);
        }

        if (contentResults.length === 0) {
          setHasMoreContentToLoad(false);
        } else {
          setHasMoreContentToLoad(true);
        }

        setContentOffset(
          newContentOffset + (newContentOffset === 0 ? 11 : contentLimit)
        );

        if (newPlaylistOffset === 0) {
          setPlaylistResults(playlistResults);
        } else {
          setPlaylistResults((prevPlaylistResults) => [
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
        setIsLoading(false);
      }
    },
    [debouncedSearchTerm, categoryFilter]
  );

  useEffect(() => {
    fetchSearchResults(0, 0); // Fetch initial content and playlist with offset 0
  }, [fetchSearchResults]);

  const handleLoadMore = () => {
    fetchSearchResults(contentOffset, playlistOffset);
  };

  return (
    <s.ContentWrapper>
      <Grid container>
        <Grid xs={10} xsOffset={1}>
          <ContentFilter
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
                </Grid>
              </s.ContentHeader>
              <s.Content>
                {isLoading ? (
                  <Lottie
                    className="loading-cubes"
                    animationData={LoadingCubes}
                    loop={true}
                  />
                ) : error ? (
                  <p>{error}</p>
                ) : (
                  playlistResults?.map((key: any) => (
                    <ContentCard
                      key={key.data.id}
                      image={
                        key.data.coverImageUrl?.playerInfo?.publicUrl || ''
                      }
                      title={key.data.title}
                      url={`/playlist/${key.id}`}
                      icon={'playlist'}
                    />
                  ))
                )}

                {!isLoading && hasMorePlaylistToLoad && (
                  <s.LoadMore onClick={handleLoadMore}>
                    <span className="inner">
                      <span className="label">{t('Load More Results')}</span>
                    </span>
                  </s.LoadMore>
                )}
              </s.Content>
            </>
          )}

          {categoryFilter !== 'playlist' && (
            <>
              <s.ContentHeader container>
                <Grid mt={8}>
                  <Typography component="h3" variant="h3">
                    <span>Content</span>
                  </Typography>
                </Grid>
              </s.ContentHeader>
              <s.Content>
                {isLoading ? (
                  <Lottie
                    className="loading-cubes"
                    animationData={LoadingCubes}
                    loop={true}
                  />
                ) : error ? (
                  <p>{error}</p>
                ) : (
                  contentResults?.map((key: any) => (
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

                {!isLoading && hasMoreContentToLoad && (
                  <s.LoadMore onClick={handleLoadMore}>
                    <span className="inner">
                      <span className="label">{t('Load More Results')}</span>
                    </span>
                  </s.LoadMore>
                )}
              </s.Content>
            </>
          )}
        </Grid>
      </Grid>
    </s.ContentWrapper>
  );
};

export default CategorizedContent;
