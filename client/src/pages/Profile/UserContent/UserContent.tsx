import ContentCard from 'components/ContentCard';
import UserContentFilter from './UserContentFilter';
import Lottie from 'lottie-react';
import LoadingCubes from 'assets/animations/loading-cubes.json';
import * as s from './UserContent.styled';
import { useCallback, useEffect, useState } from 'react';
import { SearchFilters } from '@cubeca/bff-client-oas-axios';
import useDebounce from '../../../hooks/useDebounce';
import Button from 'components/Button';
import { useTranslation } from 'react-i18next';
import { searchContent } from 'api/search';

interface UserContentProps {
  profile?: any;
}

const UserContent = ({ profile }: UserContentProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState();
  const [searchContentResults, setSearchContentResults] = useState(
    profile.content
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const { t } = useTranslation();
  const [limit, setLimit] = useState<number>(11);
  const [hasMoreToLoad, setHasMoreToLoad] = useState<boolean>(true);

  const fetchContent = useCallback(
    async (newOffset: number) => {
      setIsLoading(true);
      try {
        const searchFilters: SearchFilters = {
          category: categoryFilter === 'all' ? undefined : categoryFilter,
          profileId: profile?.id
        };

        const results = await searchContent(
          debouncedSearchTerm.trim(),
          newOffset,
          limit,
          searchFilters
        );

        const newResults = Array.isArray(results) ? results : [];

        if (newOffset === 0) {
          setSearchContentResults(newResults);
        } else {
          setSearchContentResults((prevResults: any) => [
            ...prevResults,
            ...newResults
          ]);

          if (newResults.length === 0) {
            setHasMoreToLoad(false);
          }
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

  const handleLoadMore = async () => {
    // Update the limit to 12 before fetching more content
    await setLimit(12);
    fetchContent(offset);
  };

  const displayContent =
    searchTerm.trim() !== '' || categoryFilter
      ? searchContentResults
      : profile.content;

  return (
    <s.UserContentWrapper>
      <UserContentFilter
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />

      <s.UserContent>
        {isLoading ? (
          <Lottie animationData={LoadingCubes} loop={true} />
        ) : error ? (
          <p>{error}</p>
        ) : (
          displayContent?.map((item: any) => (
            <ContentCard
              key={item.id}
              image={item.coverImageUrl?.playerInfo?.publicUrl || ''}
              title={item.title}
              url={`/content/${item.id}`}
              icon={item.type}
              hasSignLanguage={item.hasSignLanguage}
            />
          ))
        )}
        {!isLoading && debouncedSearchTerm.trim() !== '' && hasMoreToLoad && (
          <Button onClick={handleLoadMore} fullWidth={false}>
            {t('Load More')}
          </Button>
        )}
      </s.UserContent>
    </s.UserContentWrapper>
  );
};

export default UserContent;
