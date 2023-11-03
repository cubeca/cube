import Grid from '@mui/system/Unstable_Grid';
import ContentCard from 'components/ContentCard';
import { useTranslation } from 'react-i18next';
import * as s from './CategorizedContent.styled';
import { useEffect, useState } from 'react';
import { ContentLoader } from 'components/Loaders';
import ContentFilter from './CategorizedContentFilter';

import { search, searchContent } from 'api/search';
import { ContentStorage } from '@cubeca/bff-client-oas-axios';

// Category icons
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// import VolumeUpIcon from '@mui/icons-material/VolumeUp';
// import MenuBookIcon from '@mui/icons-material/MenuBook';
// import LinkIcon from '@mui/icons-material/Link';
// import { Data } from 'components/ContentCard/ContentCard.styled';

const CategorizedContent = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
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
  }, [searchTerm]);

  return (
    <s.ContentWrapper>
      <Grid container>
        <Grid xs={10} xsOffset={1}>
          <ContentFilter setSearchTerm={setSearchTerm} />

          <s.Content>
            {!isLoading ? (
              contentResults.map((key: any) => (
                <ContentCard
                  key={key.id}
                  image={key.coverImageUrl?.playerInfo.publicUrl}
                  title={key.title}
                  creator="asd"
                  url="localhost:8080/content/1"
                  icon={key.icon}
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
