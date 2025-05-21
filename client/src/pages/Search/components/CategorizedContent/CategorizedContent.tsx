/**
 * `CategorizedContent` displays content and playlists filtered by specific categories. It leverages Material UI's Grid system
 * for layout, and custom components like `ContentCard` for individual content items, and `ContentFilter` for filtering options.
 * Also, while quite similar to the UserContent component, it is used to show all search results and not just that of a specific user.
 *
 * @param {string} [tagSearchTerm] Optional search term for filtering content by tags.
 * @param {string} [languageSearchTerm] Optional search term for filtering content by language.
 */

 import Grid from '@mui/system/Unstable_Grid';
 import ContentCard from 'components/ContentCard';
 import * as s from './CategorizedContent.styled';
 import { useCallback, useEffect, useRef, useState } from 'react';
 import Lottie from 'lottie-react';
 import ContentFilter from './CategorizedContentFilter';
 import { search, searchContent, searchPlaylists } from 'api/search';
 import {
   ContentStorage,
   PlaylistStorage,
   SearchFilters
 } from '@cubeca/cube-svc-client-oas-axios';
 import LoadingCubes from 'assets/animations/loading-cubes.json';
 import useDebounce from '../../../../hooks/useDebounce';
 import { useTranslation } from 'react-i18next';
 import { Typography } from '@mui/material';
 
 interface CategorizedContentProps {
   tagSearchTerm?: string;
   languageSearchTerm?: string;
 }
 
 const CategorizedContent = ({
   tagSearchTerm,
   languageSearchTerm
 }: CategorizedContentProps) => {
   const [searchTerm, setSearchTerm] = useState('');
   const [categoryFilter, setCategoryFilter] = useState();
   const [contentResults, setContentResults] = useState<ContentStorage[]>([]);
   const [playlistResults, setPlaylistResults] = useState<PlaylistStorage[]>([]);
   const [profileResults, setProfileResults] = useState<any[]>([]);
   const [isContentLoading, setIsContentLoading] = useState(false);
   const [isPlaylistLoading, setIsPlaylistLoading] = useState(false);
   const [isProfileLoading, setIsProfileLoading] = useState(false);
   const debouncedSearchTerm = useDebounce(searchTerm, 1000, '');
   const [error, setError] = useState<string | null>(null);
   const { t } = useTranslation();
   const [contentOffset, setContentOffset] = useState<number>(0);
   const [playlistOffset, setPlaylistOffset] = useState<number>(0);
   const [contentLimit, setContentLimit] = useState<number>(12);
   const [playlistLimit, setPlaylistLimit] = useState<number>(4);
   const [profileOffset, setProfileOffset] = useState<number>(0);
   const [profileLimit, setProfileLimit] = useState<number>(4);
   const [hasMoreContentToLoad, setHasMoreContentToLoad] = useState<boolean>(true);
   const [hasMorePlaylistToLoad, setHasMorePlaylistsToLoad] = useState<boolean>(true);
   const [hasMoreProfilesToLoad, setHasMoreProfilesToLoad] = useState<boolean>(true);
 
   const contentFilterRef = useRef<any>(null);
 
   useEffect(() => {
     if ((tagSearchTerm || languageSearchTerm) && contentFilterRef.current) {
       const topPosition = contentFilterRef.current.getBoundingClientRect().top + window.pageYOffset - 100;
       window.scrollTo({ top: topPosition, behavior: 'auto' });
     }
   }, [tagSearchTerm, languageSearchTerm, isPlaylistLoading, isContentLoading]);
 
   const fetchSearchResults = useCallback(
     async (newContentOffset: number, newProfileOffset: number) => {
       setIsContentLoading(true);
       setIsProfileLoading(true);
       try {
         const searchFilters: SearchFilters = {
           category: categoryFilter === 'all' ? undefined : categoryFilter
         };
 
         const results = await search(
           debouncedSearchTerm.trim(),
           newProfileOffset,
           newProfileOffset === 0 ? 3 : profileLimit,
           searchFilters
         );
 
         if (newProfileOffset === 0) {
           setProfileResults(results.profileResults);
         } else if (results.profileResults.length > 0) {
           setProfileResults((prevProfileResults) => [
             ...prevProfileResults,
             ...results.profileResults
           ]);
         }
 
         setHasMoreProfilesToLoad(results.profileResults.length === 3);
         setProfileOffset(newProfileOffset + (newProfileOffset === 0 ? 3 : profileLimit));
 
         if (newContentOffset === 0) {
           setContentResults(results.contentResults);
         } else if (results.contentResults.length > 0) {
           setContentResults((prevContentResults) => [
             ...prevContentResults,
             ...results.contentResults
           ]);
         }
 
         setHasMoreContentToLoad(results.contentResults.length > 0);
         setContentOffset(newContentOffset + (newContentOffset === 0 ? 11 : contentLimit));
       } catch (error) {
         setError('Failed to load search results/ Échec du chargement des résultats de recherche');
       } finally {
         setIsContentLoading(false);
         setIsProfileLoading(false);
       }
     },
     [debouncedSearchTerm, categoryFilter, profileLimit, contentLimit]
   );
 
   const fetchPlaylistSearchResults = useCallback(
     async (newPlaylistOffset: number) => {
       setIsPlaylistLoading(true);
       try {
         const playlistResults = await searchPlaylists(
           debouncedSearchTerm.trim(),
           newPlaylistOffset,
           newPlaylistOffset === 0 ? 3 : playlistLimit
         );
 
         if (newPlaylistOffset === 0) {
           setPlaylistResults(playlistResults);
         } else {
           setPlaylistResults((prevPlaylistResults) => [
             ...prevPlaylistResults,
             ...playlistResults
           ]);
         }
 
         if (playlistResults.length === 0) {
           setHasMorePlaylistsToLoad(false);
         } else {
           setHasMorePlaylistsToLoad(true);
         }
 
         setPlaylistOffset(newPlaylistOffset + (newPlaylistOffset === 0 ? 3 : playlistLimit));
       } catch (error) {
         setError('Failed to load search results');
       } finally {
         setIsPlaylistLoading(false);
       }
     },
     [debouncedSearchTerm, categoryFilter]
   );
 
   const fetchInitialProfiles = useCallback(async () => {
     setIsProfileLoading(true);
     try {
       const results = await search('', 0, 3, {});
       setProfileResults(results.profileResults);
       setHasMoreProfilesToLoad(results.profileResults.length === 3);
       setProfileOffset(3);
     } catch (error) {
       setError('Failed to load profiles/ Échec du chargement des profils');
     } finally {
       setIsProfileLoading(false);
     }
   }, []);
 
   useEffect(() => {
     fetchInitialProfiles();
   }, [fetchInitialProfiles]);
 
   useEffect(() => {
     fetchSearchResults(0, 0);
   }, [fetchSearchResults]);
 
   useEffect(() => {
     fetchPlaylistSearchResults(0);
   }, [fetchPlaylistSearchResults]);
 
   const handleContentLoadMore = () => {
     fetchSearchResults(contentOffset, profileOffset);
   };
 
   const handlePlaylistLoadMore = () => {
     fetchPlaylistSearchResults(playlistOffset);
   };
 
   const handleProfileLoadMore = () => {
     fetchSearchResults(contentOffset, profileOffset);
   };
 
   return (
     <s.ContentWrapper ref={contentFilterRef}>
       <Grid container>
         <Grid xs={10} xsOffset={1}>
           <ContentFilter
             setSearchTerm={setSearchTerm}
             categoryFilter={categoryFilter}
             setCategoryFilter={setCategoryFilter}
             tagSearchTerm={tagSearchTerm || languageSearchTerm}
             aria-label='filter search results using this menu'
           />
 
           {(categoryFilter === 'all' || categoryFilter === 'playlist' || categoryFilter === undefined) && (
             <>
               <s.ContentHeader container>
                 <Grid>
                   <Typography component="h3" variant="h3">
                     <span>Playlists</span>
                   </Typography>
                   {!isPlaylistLoading && playlistResults.length === 0 && (
                     <Grid>
                       <Typography component="p" variant="body1" mt={2} aria-label='error message'>
                         <span>No playlists found/ aucun playlists trouvé</span>
                       </Typography>
                     </Grid>
                   )}
                 </Grid>
               </s.ContentHeader>
               <s.Content aria-label='a horizontal grid of Playlist cover images and titles'>
                 {isPlaylistLoading ? (
                   <Lottie
                     className="loading-cubes"
                     animationData={LoadingCubes}
                     loop={true}
                     aria-label='loading icon'
                   />
                 ) : error ? (
                   <p>{error}</p>
                 ) : (
                   playlistResults?.map((key: any) => (
                     <ContentCard
                       key={key.id}
                       image={key.coverImageUrl?.playerInfo?.publicUrl || ''}
                       title={key.title}
                       url={`/playlist/${key.id}`}
                       icon={'playlist'}
                     />
                   ))
                 )}
 
                 {!isPlaylistLoading && hasMorePlaylistToLoad && (
                   <s.LoadMore onClick={handlePlaylistLoadMore} aria-label='button to load more'>
                     <span className="inner">
                       <span className="label">{t('Load More | Charger Plus')}</span>
                     </span>
                   </s.LoadMore>
                 )}
               </s.Content>
             </>
           )}
 
           {(categoryFilter === 'all' || categoryFilter === undefined) && (
             <>
               <s.ContentHeader container>
                 <Grid>
                   <Typography component="h3" variant="h3">
                     <span>Profiles</span>
                   </Typography>
                   {!isProfileLoading && profileResults.length === 0 && (
                     <Grid>
                       <Typography component="p" variant="body1" mt={2} aria-label='error message'>
                         <span>You can now also search profiles/ Vous pouvez désormais également rechercher des profils</span>
                       </Typography>
                     </Grid>
                   )}
                 </Grid>
               </s.ContentHeader>
               <s.Content aria-label='a horizontal grid of Profile results'>
                 {isProfileLoading ? (
                   <Lottie
                     className="loading-cubes"
                     animationData={LoadingCubes}
                     loop={true}
                     aria-label='loading icon'
                   />
                 ) : error ? (
                   <Typography color="error">{error}</Typography>
                 ) : (
                   <>
                     {profileResults.map((profile) => (
                       <ContentCard
                         key={profile.id}
                         title={profile.organization}
                         image=""
                         url={`/profile/${profile.tag}`}
                         icon="profile"
                         coverImageAltText="user profile thumbnail"
                       />
                     ))}
 
                     {!isProfileLoading && hasMoreProfilesToLoad && (
                       <s.LoadMore onClick={handleProfileLoadMore} aria-label='button to load more'>
                         <span className="inner">
                           <span className="label">{t('Load More | Charger Plus')}</span>
                         </span>
                       </s.LoadMore>
                     )}
                   </>
                 )}
               </s.Content>
             </>
           )}
 
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
                         <span>No content found/ aucun contenu trouvé</span>
                       </Typography>
                     </Grid>
                   )}
                 </Grid>
               </s.ContentHeader>
               <s.Content>
                 {isContentLoading ? (
                   <Lottie
                     className="loading-cubes"
                     animationData={LoadingCubes}
                     loop={true}
                   />
                 ) : error ? (
                   <p>{error}</p>
                 ) : (
                   contentResults
                     ?.filter((key: any) => {
                       const expiryDate = new Date(key.expiry);
                       const liveDate = new Date(key.live);
                       // show content in between the expiry and live date range
                       return (
                         (expiryDate >= new Date() || !key.expiry) &&
                         (!key.live || liveDate <= new Date())
                       );
                     })
                     .map((key: any) => (
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
                 )}
 
                 {!isContentLoading && hasMoreContentToLoad && (
                   <s.LoadMore onClick={handleContentLoadMore}>
                     <span className="inner">
                       <span className="label">{t('Load More | Charger Plus')}</span>
                     </span>
                   </s.LoadMore>
                 )}
               </s.Content>
             </>
           )}
         </Grid>
       </Grid>
     </s.ContentWrapper>
   );
 };
 
 export default CategorizedContent;
