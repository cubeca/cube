import ContentCard from 'components/ContentCard';
import UserContentFilter from './UserContentFilter';
import Lottie from 'lottie-react';
import LoadingCubes from 'assets/animations/loading-cubes.json';
import * as s from './UserContent.styled';
import { searchContent } from 'api/search';
import { useEffect, useState } from 'react';
import { ContentCategories } from 'types/enums';
import { SearchFilters } from '@cubeca/bff-client-oas-axios';

interface UserContentProps {
  profile?: any;
}

const UserContent = ({ profile }: UserContentProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilterType, setSearchFilterType] = useState(
    ContentCategories.All
  );
  const [searchContentResults, setSearchContentResults] = useState(
    profile.content
  );
  const [isLoading, setIsLoading] = useState(false);

  const doSearch = async () => {
    const searchFilters: SearchFilters = {
      // type: searchFilterType,
      profileId: profile.id
    };

    return await searchContent(searchTerm, 0, 0, searchFilters);
  };

  useEffect(() => {
    let debounceTimer: any = null;

    const fetchSearchResults = async () => {
      if (searchTerm.trim() !== '') {
        setIsLoading(true);

        try {
          const results = await doSearch();
          console.log(results);
          setSearchContentResults(results);
        } catch (error) {
          console.error('An error occurred during the search:', error);
        } finally {
          setIsLoading(false);
        }
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

  const displayContent =
    searchTerm.trim() !== '' ? searchContentResults : profile.content;

  return (
    <s.UserContentWrapper>
      <UserContentFilter
        setSearchTerm={setSearchTerm}
        searchFilterType={searchFilterType}
        setSearchFilterType={setSearchFilterType}
      />

      <s.UserContent>
        {!isLoading ? (
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
        ) : (
          <Lottie
            className="loading-cubes"
            animationData={LoadingCubes}
            loop={true}
          />
        )}
      </s.UserContent>
    </s.UserContentWrapper>
  );
};

export default UserContent;
