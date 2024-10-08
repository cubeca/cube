/**
 * AddToPlaylistModal Component
 *
 * This component provides a modal for creating a new playlist and adding content to existing playlists.
 * A newly created playlist can be populated with content from the user's recent uploads or from a search of all content.
 * The modal includes a form for creating a new playlist, a list of existing playlists to add content to, and a success message.
 * The data required to create a new playlist includes a title, description, and a thumbnail image.
 *      - A user can also optionally add an embed whitelist to restrict where the playlist can be embedded.
 * This component is used in two ways:
 *      - As a standalone modal for creating a new playlist and adding content to it.
 *      - As a modal for adding content to an existing playlist.
 *
 * Props:
 * @param {boolean} isOpen - Controls the modal's open state.
 * @param {Function} onClose - Function to handle closing the modal.
 * @param {boolean} [onlyCreate=false] - If true, only show the "Create Playlist" option.
 * @param {string} [contentId] - ID of the content to be added to the playlist.
 * @param {string} profileId - Profile ID of the user.
 * @param {string} userId - User ID.
 * @param {boolean} [userVersion=false] - If true, apply user-specific customizations.
 * @param {string} [playlistId] - ID of an existing playlist.
 * @param {string} [passedPlaylistId] - ID of a playlist passed from another component.
 * @param {boolean} [cameFromSinglePlaylist=false] - If true, indicates navigation from a single playlist view.
 * @param {string} [currentEditedPlaylist] - ID of the playlist currently being edited.
 * @param {Function} [setCurrentEditedPlaylist] - Function to set the current edited playlist ID.
 * @param {Function} [refetchPlaylists] - Function to refetch the playlist data after updating it.
 * @param {string} [currentPlaylistId] - ID of the current playlist.
 *
 * Internal State:
 * - errorMessage: Error message for form validation or submission errors.
 * - showSuccessMessage: Flag to display the success message.
 * - isAdded: Indicates whether a listed piece of content has already been added to the current playlist.
 * - localPlaylists: Local state for playlist data.
 * - playlistImageFile: File object for the playlist thumbnail image.
 */

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme,
  Link as MuiLink
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Dialog from 'components/Dialog';
import * as s from './AddToPlaylistModal.styled';
import Button from 'components/Button';
import { useForm } from 'react-hook-form';
import TextInput from 'components/form/TextInput';
import { Link } from 'react-router-dom';
import LoadingCircle from 'assets/animations/loading-circle.json';
import { SetStateAction, useEffect, useRef, useState } from 'react';
import ErrorMessage from 'components/form/ErrorMessage';
import { Box } from '@mui/system';
import { ReactComponent as PlaylistIcon } from '../../assets/icons/playlist.svg';
import { ReactComponent as PlusIcon } from '../../assets/icons/plus.svg';
import CheckIcon from '@mui/icons-material/Check';
import Lottie from 'lottie-react';
import usePlaylist from 'hooks/usePlaylist';
import useProfileContent from 'hooks/useProfileContent';
import UploadInput from 'components/form/UploadInput/UploadInput';
import SearchContent from 'pages/Playlist/SearchContent';
import { useNavigate } from 'react-router-dom';
import { getProfileId } from 'utils/auth';
import { addContentToPlaylist } from 'api/playlist';
import useSinglePlaylist from 'hooks/useSinglePlaylist';
import WhitelistInput from 'components/form/WhitelistInput';
import { handleFileChange } from 'utils/fileValidation';
import EmbedToggleInput from 'components/form/EmbedToggleInput';
import { useTranslation } from 'react-i18next';

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onlyCreate?: boolean;
  contentId?: string;
  profileId: string;
  userId: string;
  userVersion?: boolean;
  playlistId?: string;
  passedPlaylistId?: string;
  cameFromSinglePlaylist?: boolean;
  currentEditedPlaylist?: string;
  setCurrentEditedPlaylist?: (playlistId: string) => void;
  refetchPlaylists?: () => void;
  currentPlaylistId?: string;
}

const AddToPlaylistModal = ({
  onClose,
  isOpen,
  contentId,
  onlyCreate = false,
  profileId,
  userId,
  playlistId,
  cameFromSinglePlaylist,
  currentEditedPlaylist,
  setCurrentEditedPlaylist,
  userVersion: userVersion = false,
  refetchPlaylists,
  currentPlaylistId
}: AddToPlaylistModalProps) => {
  const { control, handleSubmit, reset, formState, watch } = useForm({
    mode: 'onChange',
    criteriaMode: 'all'
  });

  const [errorMessage, setErrorMessage] = useState('');
  const {
    isAddLoading,
    isAddSuccess,
    isAddError,
    addResponseData,
    playlists,
    addPlaylist: handleAddPlaylist,
    addContentToPlaylist: handleAddContentToPlaylist,
    deletePlaylist: handleDeletePlaylist,
    getPlaylist: handleGetPlaylist,
    isLoading: playlistLoading,

    updatePlaylist: handleUpdatePlaylist
  } = usePlaylist(profileId, userId);
  const { data: moreContent } = useProfileContent(profileId);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isAdded, setIsAdded] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [localPlaylists, setLocalPlaylists] = useState<any>(playlists?.data);
  const [localAddResponse, setLocalAddResponse] =
    useState<any>(addResponseData);
  const [localMoreContent, setLocalMoreContent] = useState<any>(moreContent);
  const [newPlaylistId, setNewPlaylistId] = useState<string>('');
  const [playlistCreated, setPlaylistCreated] = useState(false);
  const [isPlaylistImageSelected, setIsPlaylistImageSelected] = useState(false);
  const [playlistImageFile, setPlaylistImageFile] = useState<File>();
  const [isPlaylistThumbUploadReady, setIsPlaylistThumbUploadReady] =
    useState(false);
  const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>({});
  const [tab, setTab] = useState(0);
  const [postCreateTab, setPostCreateTab] = useState(0);
  const [prevLength, setPrevLength] = useState(0);
  const [localPlaylistsHasUpdated, setLocalPlaylistsHasUpdated] =
    useState(false);
  const [playlistContents, setPlaylistContents] = useState<any>();
  const [imageTypeAccepted, setImageTypeAccepted] = useState(false);
  const [imageTypeError, setImageTypeError] = useState('');
  const [isThumbUploadReady, setIsThumbUploadReady] = useState(false);
  const [isCoverImageProperFileType, setIsCoverImageProperFileType] =
    useState(false);
  const navigate = useNavigate();
  const watchAllFields = watch();
  const isProfile = getProfileId();
  const { t } = useTranslation();
  const theme = useTheme();

  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      const dialogElement = document.getElementById('add-to-playlist-dialog');
      dialogElement?.focus();
      document.addEventListener('keydown', handleKeyDown);
    } else {
      previousFocusRef.current?.focus();
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  /** This block initializes playlist-related data using the `useSinglePlaylist` hook. Because this component is used both to create a
   * new playlist and to add content to an existing playlist, it needs to handle different scenarios for playlist data.
   *
   * It determines the playlist ID to use by checking the following in order:
   * 1. `newPlaylistId` - If present, this indicates a newly created playlist ID.
   * 2. `playlistId` - If `newPlaylistId` is not present, it falls back to an existing `playlistId`.
   * 3. `currentPlaylistId` - If neither `newPlaylistId` nor `playlistId` are present, it uses `currentPlaylistId`.
   * If none of these IDs are available, it defaults to an empty string.
   * The hook returns the current playlist's data (`playlist`), a function to fetch the current playlist (`getCurrentPlaylist`), and
   * a function to refetch the playlist data (`refetchPlaylist`).
   **/
  const {
    playlist,
    handleGetPlaylist: getCurrentPlaylist,
    refetchPlaylist
  } = useSinglePlaylist(
    newPlaylistId
      ? newPlaylistId
      : playlistId
        ? playlistId
        : currentPlaylistId
          ? currentPlaylistId
          : ''
  );

  const handleImageFileChange = (event: any) => {
    const file = event[0];
    handleFileChange(
      file,
      'image',
      setImageTypeError,
      setImageTypeAccepted,
      0.02
    );
  };

  useEffect(() => {
    if (newPlaylistId) {
      getCurrentPlaylist();
      setPlaylistContents(playlist?.data);
    } else if (playlistId) {
      getCurrentPlaylist();
      setPlaylistContents(playlist?.data);
    } else if (currentPlaylistId) {
      getCurrentPlaylist();
      setPlaylistContents(playlist?.data);
    }
  }, [newPlaylistId]);

  useEffect(() => {
    if (imageTypeAccepted) {
      setIsPlaylistThumbUploadReady(true);
      setIsCoverImageProperFileType(true);
    } else {
      setIsPlaylistThumbUploadReady(false);
      setIsCoverImageProperFileType(false);
    }
  });
  const handlePlaylistImageUpload = (files: File[]) => {
    setPlaylistImageFile(files[0]);
    setIsPlaylistImageSelected(true);
  };

  const handleThumbnailOnDrop = (files: File[]) => {
    handleImageFileChange(files);
    handlePlaylistImageUpload(files);
  };

  useEffect(() => {
    setLocalPlaylists(playlists?.data);
  }, [playlists?.data]);

  useEffect(() => {
    setLocalMoreContent(moreContent);
  }, [moreContent]);

  useEffect(() => {
    if (isAddSuccess) {
      // @ts-ignore
      setNewPlaylistId(addResponseData?.data?.id);
      if (refetchPlaylist) {
        refetchPlaylist();
      }
    }
  }, [isAddSuccess, addResponseData]);

  useEffect(() => {
    if (playlistId) {
      setNewPlaylistId(playlistId);
      setPlaylistCreated(true);
      setShowSuccessMessage(true);
      refetchPlaylists && refetchPlaylists();
    }
    if (currentEditedPlaylist) {
      setNewPlaylistId(currentEditedPlaylist);
      setPlaylistCreated(true);
      setShowSuccessMessage(true);
      refetchPlaylists && refetchPlaylists();
    }
  }, [
    playlistId,
    newPlaylistId,
    cameFromSinglePlaylist,
    isAddSuccess,
    currentEditedPlaylist
  ]);

  const onCloseAndReset = () => {
    if (cameFromSinglePlaylist) {
      setShowSuccessMessage(true);
      onClose();
      setCurrentEditedPlaylist && setCurrentEditedPlaylist('');
      refetchPlaylists && refetchPlaylists();
    } else {
      setShowSuccessMessage(false);
      reset();
      onClose();
      setCurrentEditedPlaylist && setCurrentEditedPlaylist('');
      refetchPlaylists && refetchPlaylists();
      if (playlistCreated && newPlaylistId && !currentEditedPlaylist) {
        navigate(`/playlist/${newPlaylistId}`);
      }
    }
  };

  const handleTabChange = (event: any, newValue: SetStateAction<number>) => {
    setTab(newValue);
  };
  const handlePostCreateTabChange = (
    event: any,
    newValue: SetStateAction<number>
  ) => {
    setPostCreateTab(newValue);
  };

  const addToExistingPlaylist = async (
    playlistId: string,
    contentId: string
  ) => {
    // set loading icon
    setIsLoading((prevIsLoading) => ({ ...prevIsLoading, [playlistId]: true }));
    // add content to playlist
    const playlist = localPlaylists.find((p: any) => p.id === playlistId);
    if (!playlist) {
      console.error(`Playlist with id ${playlistId} not found`);
      return;
    }
    const updatedContentIds = [...playlist.data.contentIds, contentId];

    addContentToPlaylist(playlistId, { contentId });

    setShowSuccessMessage(true);
    refetchPlaylists && refetchPlaylists();
    // change icon to checkmark

    setIsLoading((prevIsLoading) => ({
      ...prevIsLoading,
      [playlistId]: false
    }));
    setIsAdded((prevIsAdded) => ({ ...prevIsAdded, [playlistId]: true }));
  };

  const createNewPlaylistAndAddContent = async (
    playlistName: string,
    playlistDesc: string,
    contentId?: string,
    embedToggleEnabled?: boolean,
    whitelist?: string
  ) => {
    const newPlaylist = {
      title: playlistName,
      description: playlistDesc,
      profileId: profileId,
      userId: userId,
      contentIds: contentId ? [contentId] : [],
      embedToggleEnabled: embedToggleEnabled,
      embedPlaylistWhitelist: whitelist
        ? whitelist?.split(',').map((domain: string) => domain.trim())
        : []
    };

    try {
      const createdPlaylistId = await handleAddPlaylist(
        newPlaylist,
        playlistImageFile
      );

      if (isAddSuccess) {
        setPlaylistCreated(true);
        setShowSuccessMessage(true);
        refetchPlaylists && refetchPlaylists();
        const newTempPlaylist = {
          id: newPlaylistId
        };
      }
      console.log('Playlist created successfully');
    } catch (error) {
      console.error('Failed to create playlist', error);
    }
  };

  useEffect(() => {
    if (isAddSuccess) {
      setPlaylistCreated(true);
      setShowSuccessMessage(true);
      setLocalAddResponse(addResponseData);
    }
  });

  useEffect(() => {
    if (isAddSuccess) {
      setPlaylistCreated(true);
      setShowSuccessMessage(true);
      const addResponse = addResponseData;
      // @ts-ignore
      setNewPlaylistId(addResponse?.data?.id);
      refetchPlaylists && refetchPlaylists();
    }
  }, [newPlaylistId, isAddSuccess]);

  return isOpen ? (
    <Dialog
      id={'add-to-playlist-dialog'}
      aria-labelledby="add-to-playlist-dialog-title"
      title={
        onlyCreate && !cameFromSinglePlaylist && !currentEditedPlaylist
          ? 'Create a playlist'
          : 'Add to playlist'
      }
      onClose={onCloseAndReset}
      open={isOpen}
      aria-modal="true"
      ref={previousFocusRef}
    >
      <s.ModalContainer
        onlyCreate={onlyCreate}
        showSuccessMessage={showSuccessMessage}
      >
        <h2 id="add-to-playlist-dialog-title">
          {onlyCreate && !cameFromSinglePlaylist && !currentEditedPlaylist
            ? 'Create a playlist'
            : 'Add to playlist'}
        </h2>
        {!onlyCreate ? (
          <Tabs
            value={tab}
            onChange={handleTabChange}
            TabIndicatorProps={{
              style: {
                backgroundColor: 'black',
                textAlign: 'left',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                padding: '0'
              }
            }}
            sx={{
              lineHeight: '20px !important',
              height: '20px !important',
              marginBottom: '20px'
            }}
          >
            <Tab
              label="Create Playlist"
              sx={{
                color: 'black !important',
                textTransform: 'capitalize',
                padding: '0',
                marginRight: '20px'
              }}
            />
            <Tab
              label="Add to Existing Playlist"
              sx={{
                color: 'black !important',
                borderColor: 'black',
                textTransform: 'capitalize',
                padding: '0',
                marginRight: '12px'
              }}
            />
          </Tabs>
        ) : null}
        {showSuccessMessage && tab === 0 && (
          <Box sx={{ py: 0 }}>
            {isAddLoading && (
              <Box
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column'
                }}
              >
                <Lottie
                  animationData={LoadingCircle}
                  style={{ height: '250px', width: '50px', fill: 'black' }}
                  loop
                  aria-label="loading animation"
                />
                <Typography component="p" variant="body2">
                  Creating your playlist...
                </Typography>
              </Box>
            )}
            {isAddError && <p>error...</p>}
            {isAddSuccess && newPlaylistId && (
              <Box>
                <Typography component="h6" variant="h6" sx={{ mb: 1 }}>
                  Your {watchAllFields.playlistName} playlist has been created
                  successfully.
                </Typography>

                <Typography
                  component="p"
                  variant="body2"
                  sx={{ fontSize: '18px' }}
                >
                  Click{' '}
                  <Link
                    style={{ color: 'black' }}
                    to={`/playlist/${newPlaylistId}`}
                    aria-label="button to view new playlist"
                  >
                    here
                  </Link>{' '}
                  to view it or add content below via Search
                  {userVersion ? '.' : ' or Recent Uploads.'}
                </Typography>
              </Box>
            )}
          </Box>
        )}
        {tab === 0 && !showSuccessMessage && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-evenly'
            }}
          >
            <TextInput
              label="Title"
              colormode="dark"
              defaultValue={''}
              name="playlistName"
              id="playlistName"
              control={control}
              fullWidth
              variant="outlined"
              placeholder="Title (required)"
              aria-label="playlist title"
              aria-placeholder="type your playlist title"
            />
            <TextInput
              label="Description"
              colormode="dark"
              defaultValue={''}
              name="playlistDesc"
              id="playlistDesc"
              control={control}
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              placeholder="Description (required)"
              aria-label="playlist description"
              aria-placeholder="type your playlist description"
            />

            <Stack direction="row" pb={2} spacing={17} alignItems="center">
              <Typography component="p" variant="body1">
                Show embed option to public users
              </Typography>
              <EmbedToggleInput
                colormode="dark"
                defaultValue="true"
                control={control}
                name="embedToggleInput"
                id="embedToggleInput"
              />
            </Stack>

            <WhitelistInput
              control={control}
              label="Embed Whitelist"
              colormode="dark"
              name="whitelist"
              id="whitelist"
              fullWidth
              placeholder="Embedded Playlist Whitelist"
              rules={{
                required: false,
                pattern: {
                  value:
                    /^(?!https?:\/\/|www\.|ftp\.)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(,\s*(?!https?:\/\/|www\.|ftp\.)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})*$/,
                  message:
                    'Include only the domain name (e.g., example.com), not the full URL.'
                }
              }}
              aria-label="whitelist"
              aria-placeholder="type your whitelisted urls"
            />

            <Box pb={4}>
              <Accordion
                style={{ backgroundColor: theme.palette.background.default }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Grid container>
                    <Box>
                      <strong>
                        {t('You must separate websites with a comma. ')}
                      </strong>
                      {t(
                        'For added security prevent users from embedding your URL by creating a Whitelist of websites where your content can be embedded. Tap the arrow for links to code you can use to embed your content on a Whitelisted site.'
                      )}
                    </Box>
                    <Box mt={1}>
                      {t(
                        '*Note: this will require you to develop a trigger. Learn how to generate a trigger using AI. Video tutorial coming soon.'
                      )}
                    </Box>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography component="p" variant="body2">
                    {t('View code for embedding content')}{' '}
                    <MuiLink
                      href="https://codesandbox.io/p/sandbox/embed-content-d79nck"
                      sx={{ color: 'inherit' }}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="button to view code for embedding content"
                    >
                      here.
                    </MuiLink>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Box>

            <Box sx={{ marginBottom: '10px' }}>
              <UploadInput
                style="dark"
                text={'Thumbnail image (required)'}
                onDrop={handleThumbnailOnDrop}
                maxFiles={1}
                isUploadReady={isPlaylistThumbUploadReady}
              />
              {imageTypeError && (
                <Typography component="p" variant="body2" color="#FFB7C4">
                  {imageTypeError}
                </Typography>
              )}
            </Box>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            <s.ButtonContainer>
              <Button
                color={'secondary'}
                onClick={() => {
                  createNewPlaylistAndAddContent(
                    watchAllFields.playlistName,
                    watchAllFields.playlistDesc,
                    contentId!,
                    watchAllFields.embedToggleInput,
                    watchAllFields.whitelist!
                  );
                  setShowSuccessMessage(true);
                  setPlaylistCreated(true);
                }}
                fullWidth={false}
                disabled={
                  !watchAllFields.playlistName ||
                  !watchAllFields.playlistDesc ||
                  !isPlaylistThumbUploadReady
                }
                sx={{
                  mt: 2,
                  '&.Mui-disabled': {
                    color: 'white',
                    backgroundColor: '#585858'
                  }
                }}
                aria-label="button to add to playlist"
              >
                + Add
              </Button>
            </s.ButtonContainer>
          </Box>
        )}

        <>
          {tab === 1 && (
            <Typography
              component="h6"
              variant="h6"
              sx={{
                paddingTop: '24px',
                paddingBottom: '12px',
                borderBottom: '1px solid #57838b'
              }}
            >
              Add to an existing playlist:
            </Typography>
          )}
          {tab === 1 &&
            localPlaylists &&
            localPlaylists?.map((playlist: any) => (
              <s.PlaylistItemContainer key={Math.random()}>
                <s.PlaylistItemSubContainer>
                  <PlaylistIcon style={{ marginRight: '10px' }} />
                  <s.PlaylistItemTitle>
                    {playlist.data.title}
                  </s.PlaylistItemTitle>
                </s.PlaylistItemSubContainer>
                <s.PlaylistItemSubContainer>
                  {isLoading[playlist.id] ? (
                    <Lottie
                      className="loading-circle"
                      animationData={LoadingCircle}
                      loop={true}
                      autoplay={true}
                      style={{ width: '30px', height: '30px' }}
                    />
                  ) : isAdded[playlist.id] ? (
                    <CheckIcon />
                  ) : (
                    <PlusIcon
                      onClick={() => {
                        addToExistingPlaylist(playlist.id, contentId!);
                      }}
                    />
                  )}
                </s.PlaylistItemSubContainer>
              </s.PlaylistItemContainer>
            ))}
          <>
            {playlistCreated &&
              newPlaylistId &&
              !userVersion &&
              isProfile !== null &&
              (cameFromSinglePlaylist ||
                isAddSuccess ||
                currentEditedPlaylist) && (
                <Tabs
                  value={postCreateTab}
                  onChange={handlePostCreateTabChange}
                  TabIndicatorProps={{
                    style: {
                      backgroundColor: 'black',
                      textAlign: 'left',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      padding: '0'
                    }
                  }}
                  sx={{
                    lineHeight: '20px !important',
                    height: '20px !important',
                    marginBottom: '50px'
                  }}
                >
                  {!userVersion && isProfile !== null && (
                    <Tab
                      label="Search Content"
                      sx={{
                        color: 'black !important',
                        borderColor: 'black',
                        textTransform: 'capitalize',
                        padding: '0',
                        marginRight: '12px'
                      }}
                    />
                  )}
                  {!userVersion && isProfile !== null && (
                    <Tab
                      label="Recent Uploads"
                      sx={{
                        color: 'black !important',
                        textTransform: 'capitalize',
                        padding: '0',
                        marginRight: '20px'
                      }}
                    />
                  )}
                </Tabs>
              )}
          </>
          {(isAddSuccess || cameFromSinglePlaylist || currentEditedPlaylist) &&
            playlistCreated &&
            newPlaylistId &&
            postCreateTab === 1 &&
            localMoreContent &&
            localMoreContent
              .filter(
                (item: { id: string | undefined }) => item.id !== contentId
              )
              .map((item: { id: string; title: any }) => (
                <s.PlaylistItemContainer key={item.id}>
                  <s.PlaylistItemSubContainer>
                    <PlaylistIcon style={{ marginRight: '10px' }} />
                    <s.PlaylistItemTitle>{item.title}</s.PlaylistItemTitle>
                  </s.PlaylistItemSubContainer>
                  <s.PlaylistItemSubContainer>
                    {addedItems[item.id] ||
                    (playlistContents &&
                      playlistContents[0].contentItems &&
                      playlistContents[0].contentItems.length > 0 && // fix to check if content is already added
                      playlistContents[0].contentItems.some(
                        (plItem: any) => plItem.id === item.id
                      )) ? (
                      <CheckIcon />
                    ) : (
                      <PlusIcon
                        onClick={() => {
                          addToExistingPlaylist(newPlaylistId, item.id);
                          setAddedItems((prev) => ({
                            ...prev,
                            [item.id]: true
                          }));
                        }}
                      />
                    )}
                  </s.PlaylistItemSubContainer>
                </s.PlaylistItemContainer>
              ))}
          {(isAddSuccess || cameFromSinglePlaylist || currentEditedPlaylist) &&
            playlistCreated &&
            newPlaylistId &&
            postCreateTab === 0 && (
              <SearchContent
                isAddSuccess={isAddSuccess}
                playlistCreated={playlistCreated}
                newPlaylistId={newPlaylistId}
                addedItems={addedItems}
                setAddedItems={setAddedItems}
                addToExistingPlaylist={addToExistingPlaylist}
                cameFromSinglePlaylist={cameFromSinglePlaylist}
                currentEditedPlaylist={currentEditedPlaylist}
                playlistContents={playlistContents}
              />
            )}
        </>
        {playlistCreated && isAddSuccess && (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            <Button
              color={'secondary'}
              onClick={() => {
                onCloseAndReset();
                navigate(`/playlist/${newPlaylistId}`);
              }}
              fullWidth={false}
              sx={{
                mt: 2,
                '&.Mui-disabled': {
                  color: 'white',
                  backgroundColor: '#585858'
                }
              }}
              aria-label="button to go to newly created playlist"
            >
              Done
            </Button>
          </Box>
        )}
      </s.ModalContainer>
    </Dialog>
  ) : null;
};

export default AddToPlaylistModal;
