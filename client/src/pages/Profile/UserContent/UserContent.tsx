import ContentCard from 'components/ContentCard';
import UserContentFilter from './UserContentFilter';
import Lottie from 'lottie-react';
import LoadingCubes from 'assets/animations/loading-cubes.json';
import * as s from './UserContent.styled';
import { searchContent } from 'api/search';
import { useEffect, useState } from 'react';
import { SearchFilters } from '@cubeca/bff-client-oas-axios';
import useDebounce from '../../../hooks/useDebounce';

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

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsLoading(true);
      const fetchSearchResults = async () => {
        try {
          const searchFilters: SearchFilters = {
            category: categoryFilter === 'all' ? undefined : categoryFilter,
            profileId: profile?.id
          };

          const results = await searchContent(
            debouncedSearchTerm.trim(),
            0,
            12,
            searchFilters
          );
          setSearchContentResults(results);
        } catch (error) {
          console.error('An error occurred during the search:', error);
          setError('Failed to load search results');
        } finally {
          setIsLoading(false);
        }
      };

      fetchSearchResults();
    } else {
      // If searchTerm is empty, reset to the default profile content
      setSearchContentResults(profile?.content || []);
    }
  }, [debouncedSearchTerm, categoryFilter]);

  const displayContent =
    searchTerm.trim() !== '' ? searchContentResults : profile.content;

  return (
    <s.UserContentWrapper>
      <UserContentFilter
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />

      <s.UserContent>
        {isLoading ? (
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
              image={item.coverImageUrl?.playerInfo?.publicUrl || ''}
              title={item.title}
              url={`/content/${item.id}`}
              icon={item.type}
              hasSignLanguage={item.hasSignLanguage}
            />
          ))
        )}
      </s.UserContent>
    </s.UserContentWrapper>
  );
};

export default UserContent;
