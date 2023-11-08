import Grid from '@mui/system/Unstable_Grid';
import ContentCard from 'components/ContentCard';
import * as s from './CategorizedContent.styled';
import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import ContentFilter from './CategorizedContentFilter';
import { searchContent } from 'api/search';
import { ContentStorage } from '@cubeca/bff-client-oas-axios';
import { ContentCategories } from 'types/enums';
import LoadingCubes from 'assets/animations/loading-cubes.json';
const CategorizedContent = () => {
  const [searchTerm, setSearchTerm] = useState('profileId'); //this will load the most recent results
  const [searchFilterType, setSearchFilterType] = useState(
    ContentCategories.All
  );
  const [contentResults, setContentResults] = useState<ContentStorage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const doSearch = async () => {
    return await searchContent(searchTerm, 0, 0);
  };

  useEffect(() => {
    let debounceTimer: any = null;

    const fetchSearchResults = async () => {
      setIsLoading(true);

      try {
        if (searchTerm.trim() !== '') {
          const searchResults = await doSearch();
          setContentResults(searchResults);
        } else {
          setSearchTerm('profileId');
        }
      } catch (error) {
        console.error('An error occurred during the search:', error);
      } finally {
        setIsLoading(false);
      }
    };

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      fetchSearchResults();
    }, 1000);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [searchTerm, searchFilterType]);

  return (
    <s.ContentWrapper>
      <Grid container>
        <Grid xs={10} xsOffset={1}>
          <ContentFilter
            setSearchTerm={setSearchTerm}
            searchFilterType={searchFilterType}
            setSearchFilterType={setSearchFilterType}
          />

          <s.Content>
            {!isLoading ? (
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
            ) : (
              <Lottie
                className="loading-cubes"
                animationData={LoadingCubes}
                loop={true}
              />
            )}
          </s.Content>
        </Grid>
      </Grid>
    </s.ContentWrapper>
  );
};

export default CategorizedContent;
