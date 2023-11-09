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
import Button from 'components/Button';
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
  const [limit, setLimit] = useState<number>(1);

  // Refactored fetch function to be used by both useEffect and handleLoadMore
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
          limit,
          searchFilters
        );
        if (newOffset === 0) {
          setContentResults(results);
        } else {
          setContentResults((prevResults) => [...prevResults, ...results]);
        }
        setOffset(newOffset + limit);
      } catch (error) {
        console.error('An error occurred during the search:', error);
        setError('Failed to load search results');
      } finally {
        setIsLoading(false);
      }
    },
    [debouncedSearchTerm, categoryFilter, limit]
  );

  useEffect(() => {
    fetchContent(0); // Fetch initial content with offset 0
  }, [fetchContent]);

  const handleLoadMore = () => {
    fetchContent(offset); // Fetch more content with the current offset
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
          </s.Content>
          {!isLoading && (
            <Button onClick={handleLoadMore} fullWidth={false}>
              {t('Load More')}
            </Button>
          )}
        </Grid>
      </Grid>
    </s.ContentWrapper>
  );
};

export default CategorizedContent;
