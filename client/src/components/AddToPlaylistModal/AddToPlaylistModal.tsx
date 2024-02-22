import { Tab, Tabs, Typography } from '@mui/material';

import Dialog from 'components/Dialog';
import * as s from './AddToPlaylistModal.styled';
import Button from 'components/Button';
import { FieldValues, useForm } from 'react-hook-form';
import TextInput from 'components/form/TextInput';
import { Link } from 'react-router-dom';
import LoadingCircle from 'assets/animations/loading-circle.json';
import LoadingCubes from 'assets/animations/loading-cubes.json';
import { SetStateAction, useEffect, useState } from 'react';
import ErrorMessage from 'components/form/ErrorMessage';
import { Box } from '@mui/system';
import { ReactComponent as PlaylistIcon } from '../../assets/icons/playlist.svg';
import { ReactComponent as PlusIcon } from '../../assets/icons/plus.svg';
import CheckIcon from '@mui/icons-material/Check';
import Lottie from 'lottie-react';
import usePlaylist from 'hooks/usePlaylist';
import useProfileContent from 'hooks/useProfileContent';
import UploadInput from 'components/form/UploadInput/UploadInput';
import { AddContentResponseData } from '@cubeca/cube-svc-client-oas-axios';
import UserContent from 'pages/Profile/UserContent';
import SearchContent from 'pages/Playlist/SearchContent';

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onlyCreate?: boolean;
  contentId?: string;
  profileId: string;
  userId: string;
  userVersion?: boolean;
}

const AddToPlaylistModal = ({
  onClose,
  isOpen,
  contentId,
  onlyCreate = false,
  profileId,
  userId,
  userVersion: userVersion = false
}: AddToPlaylistModalProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch
  } = useForm();

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
  const [newPlaylistId, setNewPlaylistId] = useState({} as any);
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

  const watchAllFields = watch();

  const handlePlaylistImageUpload = (files: File[]) => {
    setPlaylistImageFile(files[0]);
    setIsPlaylistImageSelected(true);
  };

  const handleThumbnailOnDrop = (files: File[]) => {
    handlePlaylistImageUpload(files);
    setIsPlaylistThumbUploadReady(true);
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
    }
  }, [isAddSuccess, addResponseData]);

  const onCloseAndReset = () => {
    setShowSuccessMessage(false);
    reset();
    onClose();
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
    const updatedPlaylistData = {
      ...playlist.data,
      contentIds: updatedContentIds
    };

    handleUpdatePlaylist(playlistId, updatedPlaylistData);
    setShowSuccessMessage(true);

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
    contentId?: string
  ) => {
    const newPlaylist = {
      title: playlistName,
      description: playlistDesc,
      profileId: profileId,
      userId: userId,
      contentIds: contentId ? [contentId] : []
    };

    try {
      const createdPlaylistId = await handleAddPlaylist(
        newPlaylist,
        playlistImageFile
      );

      if (isAddSuccess) {
        setPlaylistCreated(true);
        setShowSuccessMessage(true);
        const newTempPlaylist = {
          id: newPlaylistId
        };
      }

      if (onlyCreate) {
        // onClose();
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
    }
  }, [newPlaylistId, isAddSuccess]);

  return isOpen ? (
    <Dialog
      id={'add-to-playlist'}
      title={onlyCreate ? 'Create a playlist' : 'Add to playlist'}
      onClose={onCloseAndReset}
      open={isOpen}
    >
      <s.ModalContainer
        onlyCreate={onlyCreate}
        showSuccessMessage={showSuccessMessage}
      >
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
              marginBottom: '50px'
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
          <Box sx={{ py: 6 }}>
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
                />
                <Typography component="p" variant="body2">
                  Creating your playlist...
                </Typography>
              </Box>
            )}
            {isAddError && <p>error...</p>}
            {isAddSuccess && newPlaylistId && (
              <>
                <Typography component="h6" variant="h6" sx={{ mb: 1 }}>
                  Your playlist, {watchAllFields.playlistName}, has been
                  created.
                </Typography>
                <Typography component="p" variant="body2">
                  Click{' '}
                  <Link
                    style={{ color: 'black' }}
                    to={`/playlist/${newPlaylistId}`}
                  >
                    here
                  </Link>{' '}
                  to view it.{' '}
                  {!userVersion &&
                    'Or, add more content to this playlist below - either by searching through all content on the site, or from a list of your most recent uploads.'}
                </Typography>
              </>
            )}
          </Box>
        )}
        {tab === 0 && !showSuccessMessage && (
          <>
            <Typography component="h6" variant="h6">
              Create a new playlist:
            </Typography>

            <TextInput
              colormode="dark"
              defaultValue={''}
              name="playlistName"
              id="playlistName"
              control={control}
              fullWidth
              variant="outlined"
              placeholder="Title"
            />
            <TextInput
              colormode="dark"
              defaultValue={''}
              name="playlistDesc"
              id="playlistDesc"
              control={control}
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              placeholder="Description"
            />
            <Box>
              <UploadInput
                style="dark"
                text={'Thumbnail image (required)'}
                onDrop={handleThumbnailOnDrop}
                maxFiles={1}
                isUploadReady={isPlaylistThumbUploadReady}
              />
            </Box>
            <TextInput
              colormode="dark"
              defaultValue={''}
              name="whitelist"
              id="whitelist"
              control={control}
              fullWidth
              variant="outlined"
              placeholder="Allow embed only on these URLs (optional)"
            />
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            <s.ButtonContainer>
              <Button
                color={'secondary'}
                onClick={() => {
                  createNewPlaylistAndAddContent(
                    watchAllFields.playlistName,
                    watchAllFields.playlistDesc,
                    contentId!
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
              >
                + Add
              </Button>
            </s.ButtonContainer>
          </>
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
          {playlistCreated && isAddSuccess && newPlaylistId && (
            <>
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
                {!userVersion && (
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
              {/* <Typography component="h6" variant="h6" sx={{ mt: 4 }}>
                Add More To This Playlist from Recent Uploads:
              </Typography> */}
            </>
          )}
          {playlistCreated &&
            isAddSuccess &&
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
                    {addedItems[item.id] ? (
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
          {playlistCreated &&
            isAddSuccess &&
            newPlaylistId &&
            postCreateTab === 0 && (
              <SearchContent
                isAddSuccess={isAddSuccess}
                playlistCreated={playlistCreated}
                newPlaylistId={newPlaylistId}
                addedItems={addedItems}
                setAddedItems={setAddedItems}
                addToExistingPlaylist={addToExistingPlaylist}
              />
            )}
        </>
      </s.ModalContainer>
    </Dialog>
  ) : null;
};

export default AddToPlaylistModal;
