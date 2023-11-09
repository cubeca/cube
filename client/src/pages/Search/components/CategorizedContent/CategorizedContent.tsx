import Grid from '@mui/system/Unstable_Grid';
import ContentCard from 'components/ContentCard';
import * as s from './CategorizedContent.styled';
import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import ContentFilter from './CategorizedContentFilter';
import { searchContent } from 'api/search';
import { ContentStorage, SearchFilters } from '@cubeca/bff-client-oas-axios';
import LoadingCubes from 'assets/animations/loading-cubes.json';
import useDebounce from '../../../../hooks/useDebounce';

const CategorizedContent = () => {
  const [searchTerm, setSearchTerm] = useState('profileId'); //this will load the most recent results
  const [categoryFilter, setCategoryFilter] = useState();
  const [contentResults, setContentResults] = useState<ContentStorage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 1000, 'profileId');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsLoading(true);
      const fetchSearchResults = async () => {
        try {
          const searchFilters: SearchFilters = {
            category: categoryFilter === 'all' ? undefined : categoryFilter
          };

          const results = await searchContent(
            debouncedSearchTerm.trim(),
            0,
            12,
            searchFilters
          );

          console.log(debouncedSearchTerm);
          setContentResults(results);
        } catch (error) {
          console.error('An error occurred during the search:', error);
          setError('Failed to load search results');
        } finally {
          setIsLoading(false);
        }
      };

      fetchSearchResults();
    }
  }, [debouncedSearchTerm, categoryFilter]);

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
            {/* {isLoading ? ( */}
              <Lottie
                className="loading-cubes"
                animationData={LoadingCubes}
                loop={true}
              />
            {/* ) : error ? (
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
            )} */}
          </s.Content>
        </Grid>
      </Grid>
    </s.ContentWrapper>
  );
};

export default CategorizedContent;
