import Grid from '@mui/system/Unstable_Grid';
import ContentCard from 'components/ContentCard';
import * as s from './CategorizedContent.styled';
import { useEffect, useState } from 'react';
import { ContentLoader } from 'components/Loaders';
import ContentFilter from './CategorizedContentFilter';
import { useLocation } from 'react-router-dom';
import { searchContent } from 'api/search';
import { ContentStorage } from '@cubeca/bff-client-oas-axios';
import { ContentCategories } from 'types/enums';
const CategorizedContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilterType, setSearchFilterType] = useState(
    ContentCategories.All
  );
  const [contentResults, setContentResults] = useState<ContentStorage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const doSearch = async () => {
    return await searchContent(searchTerm, 0, 0);
  };

  const location = useLocation();
  const pathnameWithoutSearch = location.pathname.replace('/search', '');

  useEffect(() => {
    let debounceTimer: any = null;

    const fetchSearchResults = async () => {
      setIsLoading(true);

      try {
        if (searchTerm.trim() !== '') {
          const searchResults = await doSearch();
          console.log(searchResults);
          setContentResults(searchResults);
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
              contentResults.map((key: any) => (
                <ContentCard
                  key={key.id}
                  image={key.coverImageUrl?.playerInfo?.publicUrl}
                  title={key.title}
                  url={`${pathnameWithoutSearch}/content/${key.id}`}
                  icon={key.type}
                  hasSignLanguage={key.hasSignLanguage}
                />
              ))
            ) : (
              <ContentLoader size={4} />
            )}
          </s.Content>
        </Grid>
      </Grid>
    </s.ContentWrapper>
  );
};

export default CategorizedContent;
