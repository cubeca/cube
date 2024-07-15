/**
 * `PrivateContent` is designed to display a user's private content.  (Content either not yet live or expired)
 *  It is only displayed to a logged in user when they are viewing their own profile.
 */

import ContentCard from 'components/ContentCard';
import UserContentFilter from '../UserContent/UserContentFilter';
import Lottie from 'lottie-react';
import LoadingCubes from 'assets/animations/loading-cubes.json';
import * as s from '../UserContent/UserContent.styled';
import { useCallback, useEffect, useState } from 'react';
import {
  ContentStorage,
  SearchFilters
} from '@cubeca/cube-svc-client-oas-axios';
import useDebounce from '../../../hooks/useDebounce';
import { useTranslation } from 'react-i18next';
import { searchContent } from 'api/search';
import Grid from '@mui/system/Unstable_Grid';
import { Typography } from '@mui/material';
import { getProfileId } from 'utils/auth';

interface PrivateContentProps {
  profile: any;
  isLoading: boolean;
}

const PrivateContent = ({ profile, isLoading }: PrivateContentProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState();
  const [contentResults, setContentResults] = useState<ContentStorage[]>([]);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 1000, '');
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const [contentOffset, setContentOffset] = useState<number>(0);
  const [contentLimit, setContentLimit] = useState<number>(12);
  const [hasMoreContentToLoad, setHasMoreContentToLoad] =
    useState<boolean>(true);

  const loggedInProfileId = getProfileId();

  const fetchContentSearchResults = useCallback(
    async (newContentOffset: number) => {
      if (profile.id === undefined) return;
      setIsContentLoading(true);

      try {
        const searchFilters: SearchFilters = {
          category: categoryFilter === 'all' ? undefined : categoryFilter,
          profileId: profile.id
        };

        const contentResults = await searchContent(
          debouncedSearchTerm.trim(),
          newContentOffset,
          newContentOffset === 0 ? 8 : contentLimit,
          searchFilters
        );

        if (newContentOffset === 0) {
          setContentResults(contentResults);
        } else if (contentResults.length > 0) {
          setContentResults((prevContentResults) => [
            ...prevContentResults,
            ...contentResults
          ]);
        }

        if (contentResults.length < 8) {
          setHasMoreContentToLoad(false);
        } else {
          setHasMoreContentToLoad(true);
        }

        setContentOffset(
          newContentOffset + (newContentOffset === 0 ? 8 : contentLimit)
        );
      } catch (error) {
        setError('Failed to load search results');
      } finally {
        setIsContentLoading(false);
      }
    },
    [debouncedSearchTerm, categoryFilter, isLoading]
  );

  const handleContentLoadMore = () => {
    fetchContentSearchResults(contentOffset);
  };

  useEffect(() => {
    fetchContentSearchResults(0);
  }, [fetchContentSearchResults, debouncedSearchTerm]);

  return (
    <s.UserContentWrapper>
      {isLoading ? (
        <Lottie
          className="loading-cubes"
          animationData={LoadingCubes}
          loop={true}
          style={{ height: '500px' }}
        />
      ) : (
        <Grid container>
          <Grid xs={12} xsOffset={1}>
            <UserContentFilter
              setSearchTerm={setSearchTerm}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
            />

            {categoryFilter !== 'playlist' && (
              <>
                <s.ContentHeader container>
                  <Grid mt={8}>
                    <Typography component="h3" variant="h3">
                      <span>Content</span>
                    </Typography>
                    {!isContentLoading && contentResults.length === 0 && (
                      <Grid>
                        <Typography component="p" variant="body1" mt={2}>
                          <span>No content found</span>
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </s.ContentHeader>
                <s.UserContent>
                  {isContentLoading ? (
                    <Lottie
                      className="loading-cubes"
                      animationData={LoadingCubes}
                      loop={true}
                    />
                  ) : error ? (
                    <p>{error}</p>
                  ) : (
                    !isContentLoading &&
                    (() => {
                      const filteredResults = contentResults?.filter(
                        (key: any) => {
                          const expiryDate = new Date(
                            key.expiry ? key.expiry : null
                          );
                          const liveDate = new Date(key.live ? key.live : null);
                          return (
                            ((key.expiry && expiryDate <= new Date()) ||
                              (key.live && liveDate >= new Date())) &&
                            key.profileId === loggedInProfileId
                          );
                        }
                      );

                      return filteredResults && filteredResults.length > 0 ? (
                        filteredResults.map((key: any) => (
                          <ContentCard
                            key={key.id}
                            image={
                              key.coverImageUrl?.playerInfo?.publicUrl ||
                              key.coverImageExternalUrl ||
                              ''
                            }
                            title={key.title}
                            url={`/content/${key.id}`}
                            icon={key.type}
                            hasSignLanguage={key.hasSignLanguage}
                          />
                        ))
                      ) : (
                        <Grid>
                          <Typography
                            component="p"
                            variant="body1"
                            mt={2}
                            ml={2}
                          >
                            <span>
                              No private content found. Private content is
                              content that is either not yet live or already
                              expired. You can adjust these dates by editing
                              your content.
                            </span>
                          </Typography>
                        </Grid>
                      );
                    })()
                  )}

                  {!isContentLoading && hasMoreContentToLoad && (
                    <s.LoadMore onClick={handleContentLoadMore}>
                      <span className="inner">
                        <span className="label">{t('Load More Results')}</span>
                      </span>
                    </s.LoadMore>
                  )}
                </s.UserContent>
              </>
            )}
          </Grid>
        </Grid>
      )}
    </s.UserContentWrapper>
  );
};

export default PrivateContent;
