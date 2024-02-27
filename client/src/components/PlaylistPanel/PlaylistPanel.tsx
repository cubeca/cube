import {
  Box,
  DialogActions,
  DialogTitle,
  TextField,
  Typography
} from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import LoadingCubes from 'assets/animations/loading-cubes.json';
import * as s from './PlaylistPanel.styled';
import { ReactComponent as PlaySymbol } from '../../assets/icons/play-circle.svg';
import EditIcon from '@mui/icons-material/Edit';
import PlaylistItem from './PlaylistItem';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import AddToPlaylistModal from 'components/AddToPlaylistModal';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import usePlaylist from 'hooks/usePlaylist';
import useProfileContent from 'hooks/useProfileContent';
import { Content } from 'types/content';
import Button from 'components/Button';
import { Link } from 'react-router-dom';
import { getProfileTag } from 'utils/auth';
import useSinglePlaylist from 'hooks/useSinglePlaylist';

interface Playlist {
  id: string;
  name: string;
  description: string;
  profileId: string;
  userId: string;
  contentItems: string[];
  data: any;
  content: Content[];
  created_at: string;
  updated_at: string;
}

interface Props {
  playlists: any;
  test?: Playlist[];
  profileId: string;
  userId: string;
  cameFromSinglePlaylist?: boolean;
  isLoading?: boolean;
  refetchPlaylist?: any;
  refetchPlaylists?: any;
  currentPlaylistId?: string;
  isLoggedIn?: boolean;
  embed?: boolean;
}

const PlaylistPanel: React.FC<Props> = ({
  playlists,
  profileId,
  userId,
  cameFromSinglePlaylist,
  isLoading: isPlaylistDataLoading,
  refetchPlaylist,
  refetchPlaylists,
  currentPlaylistId,
  embed
}: Props) => {
  const { data: moreContent } = useProfileContent(profileId);
  const [editMode, setEditMode] = useState<string | null>(null);
  const {
    playlist,
    handleGetPlaylist: getCurrentPlaylist,
    refetchPlaylist: refetchCurrentPlaylist
  } = useSinglePlaylist(embed ? currentPlaylistId || '' : '');
  const [editedTitles, setEditedTitles] = useState<{ [id: string]: string }>(
    isPlaylistDataLoading || embed
      ? {}
      : playlists.reduce(
          (acc: any, playlist: any) => ({
            ...acc,
            [playlist.id]: playlist.data.name
          }),
          {}
        )
  );
  const [editedDescription, setEditedDescription] = useState<{
    [id: string]: string;
  }>(
    isPlaylistDataLoading || embed
      ? {}
      : playlists.reduce(
          (acc: any, playlist: any) => ({
            ...acc,
            [playlist.id]: playlist.data.description
          }),
          {}
        )
  );

  const [tempTitles, setTempTitles] = useState<{ [id: string]: string }>({});
  const [localPlaylists, setLocalPlaylists] = useState(
    embed ? playlist : playlists
  );
  const [editedPlaylistId, setEditedPlaylistId] = useState<string | undefined>(
    undefined
  );
  const [currentEditedPlaylist, setCurrentEditedPlaylist] = useState<any>();
  const [textFieldDescriptionValue, setTextFieldDescriptionValue] =
    useState<string>('');
  const [editingPlaylist, setEditingPlaylist] = useState('');
  const [isCreatePlaylistModalOpen, setIsCreatePlaylistModalOpen] =
    useState(false);
  const [localMoreContent, setLocalMoreContent] = useState<any>(moreContent);
  const [open, setOpen] = useState(false);

  const {
    addPlaylist: handleAddPlaylist,
    deletePlaylist: handleDeletePlaylist,
    updatePlaylist: handleUpdatePlaylist,
    isLoading,
    isError
  } = usePlaylist(profileId, userId);

  const profileTag = getProfileTag();

  // drag and drop items
  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const updatedPlaylists = [...localPlaylists];
    const playlist = updatedPlaylists.find(
      (pl) => pl.id === source.droppableId
    );

    const [removed] = playlist?.contentItems?.splice(source.index, 1) ?? [];
    if (playlist) {
      playlist.contentItems.splice(destination.index, 0, removed);
    }

    setLocalPlaylists(updatedPlaylists);
  };

  useEffect(() => {
    setLocalMoreContent(moreContent);
  }, [moreContent]);

  useEffect(() => {
    if (editedPlaylistId) {
      setEditMode(null);
      setEditedPlaylistId(undefined);
    }
  }, [localPlaylists, editedPlaylistId]);

  useEffect(() => {
    if (playlists) {
      setLocalPlaylists(playlists);
    }
  }, [playlists]);

  const handleUpdateLocalPlaylist = (
    playlistId: string,
    newTitle: string,
    newDescription: string
  ) => {
    setLocalPlaylists((prevPlaylists: any) => {
      return prevPlaylists.map((playlist: any) => {
        if (playlist.id === playlistId) {
          return {
            ...playlist,
            title: newTitle,
            description: newDescription,
            data: {
              ...playlist.data,
              title: newTitle,
              description: newDescription
            }
          };
        } else {
          return playlist;
        }
      });
    });
  };

  function handleClose() {
    setIsCreatePlaylistModalOpen(false);
    setOpen(false);
    if (refetchPlaylist) {
      refetchPlaylist();
    }
  }

  const deletePlaylistItem = (playlistId: string, contentId: string) => {
    const updatedPlaylists = [...localPlaylists];

    const playlist = updatedPlaylists.find((pl) => pl.id === playlistId);

    if (playlist) {
      playlist.contentItems = playlist.contentItems.filter(
        (content: { id: string }) => content.id !== contentId
      );
      playlist.data.contentIds = playlist.data.contentIds.filter(
        (id: string) => id !== contentId
      );

      setLocalPlaylists(updatedPlaylists);
      handleUpdatePlaylist(playlist.id, playlist.data);
    }
  };

  const deletePlaylist = (id: string) => {
    handleDeletePlaylist(id)
      .then(() => {
        handleClose();
        setOpen(false);
        // remove playlist from local state
        setLocalPlaylists((prevPlaylists: any) => {
          return prevPlaylists.filter((playlist: any) => playlist.id !== id);
        });
        if (cameFromSinglePlaylist && profileId) {
          window.location.href = `/profile/${profileTag}`;
        } else if (cameFromSinglePlaylist && userId) {
          window.location.href = `/user/${userId}`;
        } else {
          return;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Grid container>
      <s.CustomDialog
        title={'Are you sure?'}
        id={'alert-dialog-title'}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ fontFamily: 'Inter', fontWeight: '400', maxWidth: '250px' }}
        >
          {'Are you sure you want to delete this playlist?'}
        </DialogTitle>
        <DialogActions
          sx={{ justifyContent: 'space-evenly', alignItems: 'center' }}
        >
          <Button onClick={handleClose} color="secondary">
            No
          </Button>
          <Button
            onClick={() => deletePlaylist(editMode || '')}
            color="secondary"
          >
            Yes
          </Button>
        </DialogActions>
      </s.CustomDialog>
      <AddToPlaylistModal
        isOpen={isCreatePlaylistModalOpen}
        onClose={handleClose}
        onlyCreate={true}
        profileId={profileId}
        userId={userId}
        playlistId={cameFromSinglePlaylist ? playlists[0].id : undefined}
        passedPlaylistId={cameFromSinglePlaylist ? playlists[0].id : undefined}
        currentEditedPlaylist={currentEditedPlaylist}
        setCurrentEditedPlaylist={setCurrentEditedPlaylist}
        cameFromSinglePlaylist={cameFromSinglePlaylist}
        refetchPlaylists={refetchPlaylists}
        currentPlaylistId={currentPlaylistId}
      />
      <Grid xs={10} xsOffset={1} mdOffset={0} md={12}>
        <s.PlaylistStack>
          {isLoading || isPlaylistDataLoading || !embed ? (
            <Lottie
              className="loading-cubes"
              animationData={LoadingCubes}
              loop={true}
              autoplay={true}
              style={{ height: '500px' }}
            />
          ) : (
            localPlaylists &&
            localPlaylists.map((playlist: any) => (
              <Box key={playlist.id}>
                <s.PlaylistTitleContainer key={playlist.id}>
                  <s.PlaylistTitleSubContainer>
                    <PlaySymbol
                      style={{
                        height: '32px',
                        width: '32px',
                        marginRight: '10px'
                      }}
                    />

                    {editMode === playlist.id ? (
                      <s.TextFieldContainer>
                        <TextField
                          className="editInput"
                          value={editedTitles[playlist.id] || ''}
                          // value={textFieldTitleValue}
                          onChange={(e) => {
                            setEditedTitles({
                              ...editedTitles,
                              [playlist.id]: e.target.value
                            });
                          }}
                          fullWidth
                          variant="standard"
                          inputProps={{
                            style: {
                              color: '#95F5CB',
                              fontFamily: 'Rubik',
                              fontSize: '24px',
                              lineHeight: '40px',
                              paddingBottom: '0 !important',
                              marginBottom: '0 !important',
                              marginTop: '0 !important',
                              fontStyle: 'normal',
                              fontWeight: 400,

                              width: '100%'
                            }
                          }}
                        />
                        <s.IconContainer>
                          <CloseIcon
                            onClick={() => {
                              setEditMode(null);
                              setEditingPlaylist('');
                            }}
                          />

                          <CheckIcon
                            onClick={(event) => {
                              event.stopPropagation();
                              const newTitle = editedTitles[playlist.id];
                              const newDescription =
                                editedDescription[playlist.id];
                              handleUpdateLocalPlaylist(
                                playlist.id,
                                editedTitles[playlist.id],
                                editedDescription[playlist.id]
                              );
                              const updatedPlaylistData = {
                                ...playlist.data,
                                title: newTitle,
                                description: newDescription
                              };
                              setTempTitles((prevTempTitles) => ({
                                ...prevTempTitles,
                                [playlist.id]: editedTitles[playlist.id],
                                [playlist.id]: editedDescription[playlist.id]
                              }));
                              setEditedPlaylistId(playlist.id);

                              handleUpdatePlaylist(
                                playlist.id,
                                updatedPlaylistData
                              );
                            }}
                          />
                        </s.IconContainer>
                      </s.TextFieldContainer>
                    ) : (
                      <Link
                        to={`/playlist/${playlist.id}`}
                        style={{ textDecoration: 'inherit' }}
                      >
                        <s.PlaylistTitle>
                          {editedTitles[playlist.id] ||
                            localPlaylists.find(
                              (p: any) => p.id === playlist.id
                            )?.data.title}
                        </s.PlaylistTitle>
                      </Link>
                    )}
                  </s.PlaylistTitleSubContainer>
                  <s.EditWrapper>
                    {playlist.data.profileId === profileId &&
                    playlist.data.userId === userId ? (
                      <>
                        <button
                          onClick={() => {
                            setIsCreatePlaylistModalOpen(true);
                            setCurrentEditedPlaylist(playlist.id);
                          }}
                        >
                          <AddIcon />
                        </button>
                      </>
                    ) : null}
                  </s.EditWrapper>
                  {editMode !== playlist.id && (
                    <s.EditWrapper>
                      {playlist.data.profileId === profileId &&
                      playlist.data.userId === userId ? (
                        <>
                          <button
                            onClick={() => {
                              setEditMode(playlist.id);
                              setTextFieldDescriptionValue(
                                playlist.data.description
                              );
                              setEditingPlaylist(playlist.id || '');
                              setEditedTitles({
                                ...editedTitles,
                                [playlist.id]:
                                  editedTitles[playlist.id] ||
                                  playlist.data.title
                              });
                            }}
                          >
                            <EditIcon />
                          </button>
                        </>
                      ) : null}
                    </s.EditWrapper>
                  )}
                </s.PlaylistTitleContainer>
                <Box sx={{ marginLeft: '42px' }}>
                  <s.PlaylistDescriptionContainer>
                    {editMode === playlist.id ? (
                      <TextField
                        className="editInput"
                        value={editedDescription[playlist.id] || ''}
                        onChange={(e) => {
                          setEditedDescription({
                            ...editedDescription,
                            [playlist.id]: e.target.value
                          });
                        }}
                        fullWidth
                        variant="outlined"
                        multiline
                        inputProps={{
                          style: {
                            marginBottom: 0,

                            width: '100%'
                          }
                        }}
                      />
                    ) : (
                      <s.PlaylistDescription>
                        {editedDescription[playlist.id] ||
                          localPlaylists.find((p: any) => p.id === playlist.id)
                            ?.data.description}
                      </s.PlaylistDescription>
                    )}
                  </s.PlaylistDescriptionContainer>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId={playlist.id}>
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {playlist.contentItems &&
                            playlist.contentItems.map(
                              (content: any, index: any) => (
                                <Draggable
                                  key={content.id}
                                  draggableId={content.id}
                                  index={index}
                                  isDragDisabled={editMode !== playlist.id}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      <PlaylistItem
                                        type={content.category[0].toLowerCase()}
                                        bgUrl={
                                          content.coverImageUrl.playerInfo
                                            .publicUrl
                                        }
                                        alt={content.title}
                                        title={content.title}
                                        url={content.id}
                                        editMode={editMode}
                                        playlistId={playlist.id}
                                        editingPlaylist={editingPlaylist}
                                        setEditingPlaylist={setEditingPlaylist}
                                        deletePlaylistItem={deletePlaylistItem}
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              )
                            )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                  {editMode === playlist.id && (
                    <s.DeletePlaylistContainer>
                      <s.DeletePlaylistText onClick={() => setOpen(true)}>
                        Delete Playlist
                      </s.DeletePlaylistText>
                    </s.DeletePlaylistContainer>
                  )}
                </Box>
              </Box>
            ))
          )}
        </s.PlaylistStack>
      </Grid>
    </Grid>
  );
};

export default PlaylistPanel;
