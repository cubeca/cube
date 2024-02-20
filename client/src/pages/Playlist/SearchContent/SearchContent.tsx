import ContentCard from 'components/ContentCard';
import UserContentFilter from './SearchContentFilter';
import Lottie from 'lottie-react';
import LoadingCubes from 'assets/animations/loading-cubes.json';
import * as s from './SearchContent.styled';
import { useCallback, useEffect, useState, useRef } from 'react';
import { SearchFilters } from '@cubeca/cube-svc-client-oas-axios';
import useDebounce from '../../../hooks/useDebounce';
import { useTranslation } from 'react-i18next';
import { searchContent } from 'api/search';
import { ReactComponent as PlaylistIcon } from '../../../assets/icons/playlist.svg';
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus.svg';
import CheckIcon from '@mui/icons-material/Check';

interface SearchContentProps {
  profile?: any;
  isAddSuccess: boolean;
  playlistCreated: boolean;
  newPlaylistId: string;
  addedItems: any;
  setAddedItems: any;
  addToExistingPlaylist: any;
}

const SearchContent = ({
  profile,
  isAddSuccess,
  playlistCreated,
  newPlaylistId,
  addedItems,
  setAddedItems,
  addToExistingPlaylist
}: SearchContentProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState();
  const [searchContentResults, setSearchContentResults] = useState<any>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const { t } = useTranslation();
  const [limit, setLimit] = useState<number>(12);
  const [hasMoreToLoad, setHasMoreToLoad] = useState<boolean>(true);
  const isInitialMount = useRef(true);

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
        if (newResults.length <= 12) {
          setHasMoreToLoad(false);
        }

        setHasSearched(true);
        if (newOffset === 0) {
          setSearchContentResults(newResults);
        } else {
          setSearchContentResults((prevResults: any) => [
            ...prevResults,
            ...newResults
          ]);
        }

        setOffset(newOffset + limit);
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
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      fetchContent(0);
    }
  }, [fetchContent, debouncedSearchTerm]);

  const handleLoadMore = () => {
    fetchContent(offset);
  };

  const displayContent =
    searchTerm.trim() !== '' || categoryFilter ? searchContentResults : null;

  return (
    <s.UserContentWrapper>
      <UserContentFilter
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />

      <s.UserContent>
        {isLoading && !hasSearched ? (
          <></>
        ) : // <Lottie
        //   className="loading-cubes"
        //   animationData={LoadingCubes}
        //   loop={true}
        // />
        error ? (
          <p>{error}</p>
        ) : (
          playlistCreated &&
          isAddSuccess &&
          newPlaylistId &&
          displayContent &&
          displayContent.map((item: { id: string; title: any }) => (
            <s.PlaylistItemContainer key={item.id}>
              <s.PlaylistItemSubContainer>
                <PlaylistIcon style={{ marginRight: '10px' }} />
                <s.PlaylistItemTitle>{item.title}</s.PlaylistItemTitle>
              </s.PlaylistItemSubContainer>
              <s.PlaylistItemSubContainer>
                {addedItems[item.id] ? (
                  <CheckIcon />
                ) : (
                  <PlusIcon
                    onClick={() => {
                      addToExistingPlaylist(newPlaylistId, item.id);
                      setAddedItems((prev: any) => ({
                        ...prev,
                        [item.id]: true
                      }));
                    }}
                  />
                )}
              </s.PlaylistItemSubContainer>
            </s.PlaylistItemContainer>
          ))
        )}
        {!isLoading && debouncedSearchTerm.trim() !== '' && hasMoreToLoad && (
          <s.LoadMore onClick={handleLoadMore}>
            <span className="inner">
              <span className="label">{t('Load More Results')}</span>
            </span>
          </s.LoadMore>
        )}
      </s.UserContent>
    </s.UserContentWrapper>
  );
};

export default SearchContent;
