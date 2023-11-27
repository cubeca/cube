import Grid from '@mui/system/Unstable_Grid';
import ContentCard from 'components/ContentCard';
import * as s from './CategorizedContent.styled';
import { useCallback, useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import ContentFilter from './CategorizedContentFilter';
import { searchContent } from 'api/search';
import { ContentStorage, SearchFilters } from '@cubeca/bff-client-oas-axios';
import LoadingCubes from 'assets/animations/loading-cubes.json';
import useDebounce from '../../../../hooks/useDebounce';
import { useTranslation } from 'react-i18next';

const CategorizedContent = () => {
  const [searchTerm, setSearchTerm] = useState('profileId');
  const [categoryFilter, setCategoryFilter] = useState();
  const [contentResults, setContentResults] = useState<ContentStorage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 1000, 'profileId');
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(12);
  const [hasMoreToLoad, setHasMoreToLoad] = useState<boolean>(true);

  const fetchContent = useCallback(
    async (newOffset: number) => {
      setIsLoading(true);
      try {
        const searchFilters: SearchFilters = {
          category: categoryFilter === 'all' ? undefined : categoryFilter
        };

        const results = await searchContent(
          debouncedSearchTerm.trim(),
          newOffset,
          newOffset === 0 ? 11 : limit,
          searchFilters
        );

        const newResults = Array.isArray(results) ? results : [];

        if (newOffset === 0) {
          setContentResults(results);
        } else {
          setContentResults((prevResults) => [...prevResults, ...results]);

          if (newResults.length <= 0) {
            setHasMoreToLoad(false);
          }
        }
        setOffset(newOffset + (newOffset === 0 ? 11 : limit));
      } catch (error) {
        console.error('An error occurred during the search:', error);
        setError('Failed to load search results');
      } finally {
        setIsLoading(false);
      }
    },
    [debouncedSearchTerm, categoryFilter]
  );

  useEffect(() => {
    fetchContent(0); // Fetch initial content with offset 0
  }, [fetchContent]);

  const handleLoadMore = () => {
    fetchContent(offset);
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
                  image={key.coverImageUrl?.playerInfo?.publicUrl || ''}
                  title={key.title}
                  url={`/content/${key.id}`}
                  icon={key.type}
                  hasSignLanguage={key.hasSignLanguage}
                />
              ))
            )}

            {!isLoading &&
              debouncedSearchTerm.trim() !== '' &&
              hasMoreToLoad && (
                <s.LoadMore onClick={handleLoadMore}>
                  <span className="inner">
                    <span className="label">{t('Load More Results')}</span>
                  </span>
                </s.LoadMore>
              )}
          </s.Content>
        </Grid>
      </Grid>
    </s.ContentWrapper>
  );
};

export default CategorizedContent;
