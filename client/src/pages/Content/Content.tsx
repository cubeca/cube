import React, { useEffect, useRef, useState } from 'react';
import MediaPlayer from 'components/MediaPlayer';
import YouTubePlayer from 'components/YouTubePlayer';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Stack, Typography, useTheme, Box, Link } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import CodeIcon from '@mui/icons-material/Code';
import FlagIcon from '@mui/icons-material/Flag';

import useContentDetails from 'hooks/useContentDetails';

import MoreContent from './MoreContent';
import Contributors from './Contributors';

import { MediaPlayerLoader, MediaMetaDataLoader } from 'components/Loaders';
import Footer from 'components/layout/Footer';
import * as s from './Content.styled';
import { CollaboratorDetails, Contributor } from 'types/content';
import AgeCheckModal from 'components/AgeCheckModal';
import PDFReader from 'components/PDFReader';
import LinkPlayer from 'components/LinkPlayer/LinkPlayer';
import { getIDfromURL } from 'utils/youtubeUtils';
import DeleteContentButton from 'components/DeleteContentButton';
import { getProfileId } from 'utils/auth';
import EmbedModal from 'components/EmbedModal';
import Lottie from 'lottie-react';
import LoadingCubes from 'assets/animations/loading-cubes.json';
import { useLocation } from 'react-router-dom';
import ReportContentModal from 'components/ReportContentModal';
import AddToPlaylistModal from 'components/AddToPlaylistModal';
import { getAuthTokenPayload } from 'utils/auth';
import useAuth from 'hooks/useAuth';

const Video = () => {
  const { isLoggedIn } = useAuth();
  const { t } = useTranslation();
  const user = getAuthTokenPayload();
  const theme = useTheme();
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);
  const { data: content, isLoading, refetch } = useContentDetails();
  const createdAt = content?.createdAt;

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  const query = useQuery();
  const playlistId = query.get('playlist');

  const formattedCreatedDate = content
    ? new Date(createdAt as string).toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  const [isSuitableForChildrenModalOpen, setIsSuitableForChildrenModalOpen] =
    useState(false);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [subtitleUrl, setSubtitleUrl] = useState('');
  const [subtitleIsLoading, setSubtitleIsLoading] = useState(true);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [isReportContentModalOpen, setIsReportContentModalOpen] =
    useState(false);
  const [userId, setUserId] = useState('');

  let youtubeID = '';

  const videoUrl = content?.mediaUrl?.playerInfo?.hlsUrl;
  const audioUrl = content?.mediaUrl?.playerInfo?.publicUrl;
  const coverArtUrl = content?.coverImageUrl
    ? content?.coverImageUrl?.playerInfo?.publicUrl
    : content?.coverImageExternalUrl;
  const pdfUrl = content?.mediaUrl?.playerInfo?.publicUrl;
  const bannerImage = content?.bannerImageUrl
    ? content?.bannerImageUrl?.playerInfo?.publicUrl
    : content?.bannerImageExternalUrl;
  const linkUrl = content?.externalUrl;
  const linkTitle = content?.title;
  const mediaType = content?.type;
  const profileId = content?.profileId;
  const coverImageAltText = content?.coverImageText;
  const bannerImageAltText = content?.bannerImageText;
  const loggedInProfileId = getProfileId();
  const videoBeingProcessed = !content?.mediaUrl?.playerInfo?.hlsUrl;
  const audioBeingProcessed = !content?.mediaUrl?.playerInfo?.publicUrl;
  const embedContentWhitelist = content?.embedContentWhitelist;
  const embedToggleEnabled = content?.embedToggleEnabled;

  // if content contains a link URL, check if it's a youtube link and get the ID
  if (linkUrl) {
    youtubeID = getIDfromURL(linkUrl);
  }
  const onOver18Click = () => {
    setIsSuitableForChildrenModalOpen(false);
  };

  const onUnder18Click = () => {
    setIsSuitableForChildrenModalOpen(false);
  };

  // set subtitleUrl when content changes
  useEffect(() => {
    setSubtitleUrl(content?.vttFileUrl?.playerInfo?.publicUrl || '');
  }, [content]);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getAuthTokenPayload();
      setUserId((user as any).sub);
    };

    fetchUser();
  }, [user]);

  // after editing subtitles, refetch content and set subtitleUrl again to
  // prevent stale data from being displayed
  useEffect(() => {
    setSubtitleIsLoading(true);
    refetch().then((newData) => {
      refetch().then((newData: any) => {
        setSubtitleUrl(newData?.data?.data?.vttFileUrl?.playerInfo?.publicUrl);
        setSubtitleIsLoading(false);
      });
    });
  }, [location, refetch, subtitleUrl]);

  useEffect(() => {
    if (contentRef.current) {
      const headerHeight = document.querySelector('header')?.clientHeight || 0;
      const contentTop = contentRef.current.offsetTop - headerHeight;
      window.scrollTo({ top: contentTop, behavior: 'auto' });
    }
  }, [contentRef.current, content]);

  useEffect(() => {
    if (content?.isSuitableForChildren === false) {
      setIsSuitableForChildrenModalOpen(true);
    }
  }, [content?.isSuitableForChildren]);

  useEffect(() => {
    if (
      (embedContentWhitelist &&
        embedContentWhitelist.length > 0 &&
        !(
          embedContentWhitelist.length === 1 && embedContentWhitelist[0] === ''
        )) ||
      (!embedToggleEnabled && embedToggleEnabled !== undefined)
    ) {
      setShowEmbedModal(false);
    } else {
      setShowEmbedModal(true);
    }
  }, [isLoading, content, embedContentWhitelist, embedToggleEnabled]);

  function handleClose() {
    setIsSuitableForChildrenModalOpen(false);
    setIsEmbedModalOpen(false);
    setIsReportContentModalOpen(false);
    setIsPlaylistModalOpen(false);
  }

  const openEmbedModal = () => {
    setIsEmbedModalOpen(true);
  };
  const openPlaylistModal = () => {
    if (isLoggedIn) {
      setIsPlaylistModalOpen(true);
    } else {
      window.location.href = '/login';
    }
  };

  const openReportContentModal = () => {
    setIsReportContentModalOpen(true);
  };

  function getContributorRole(
    role: string,
    count: number,
    preferredTitle?: string
  ): string {
    let roleStr = '';
    if (preferredTitle && preferredTitle !== '') {
      roleStr = preferredTitle;
    } else {
      switch (role) {
        case 'artist':
          roleStr = 'Artist';
          break;
        case 'editor':
          roleStr = 'Editor';
          break;
        case 'camera_operator':
          roleStr = 'Camera Operator';
          break;
        case 'sound_technician':
          roleStr = 'Sound Technician';
          break;
        // Add more roles as needed
        default: // capitalize first letter of role
          roleStr = role.charAt(0).toUpperCase() + role.slice(1);
      }
    }
    // Add 's' to role if there are multiple contributors
    // if the role already ends in an 's', don't add another 's'
    // for example: 'props' should not become 'propss'
    return count > 1 && !roleStr.endsWith('s') ? roleStr + 's' : roleStr;
  }

  const youtubeContent = (
    <s.VideoWrapper>
      <YouTubePlayer id={youtubeID} />
    </s.VideoWrapper>
  );

  const audioContent = (
    <s.AudioWrapper>
      {audioBeingProcessed || subtitleIsLoading ? (
        <s.LoadingWrapper>
          <Lottie
            className="loading-cubes"
            animationData={LoadingCubes}
            loop={true}
            style={{ width: '170px', height: '170px' }}
          />
          <s.LoadingText>
            Your audio is being processed. This may take a few minutes.
          </s.LoadingText>
        </s.LoadingWrapper>
      ) : (
        <MediaPlayer
          url={audioUrl || ''}
          coverArtUrl={coverArtUrl}
          coverImageAltText={coverImageAltText}
          subtitleUrl={subtitleUrl}
        />
      )}
    </s.AudioWrapper>
  );

  const pdfContent = <PDFReader url={pdfUrl || ''} />;

  const videoContent = (
    <s.VideoWrapper>
      {videoBeingProcessed || subtitleIsLoading ? (
        <s.LoadingWrapper>
          <Lottie
            className="loading-cubes"
            animationData={LoadingCubes}
            loop={true}
            style={{ width: '170px', height: '170px' }}
          />
          <s.LoadingText>
            Your video is being processed. This may take a few minutes.
          </s.LoadingText>
        </s.LoadingWrapper>
      ) : (
        <MediaPlayer
          url={videoUrl || ''}
          coverImageAltText={coverImageAltText}
          subtitleUrl={subtitleUrl}
        />
      )}
    </s.VideoWrapper>
  );

  const linkContent = (
    <s.LinkWrapper>
      <LinkPlayer
        url={linkUrl || ''}
        cover={bannerImage || ''}
        title={linkTitle || ''}
        coverImageAltText={coverImageAltText}
        bannerImageAltText={bannerImageAltText}
      />
    </s.LinkWrapper>
  );

  return (
    <Box ref={contentRef}>
      <AgeCheckModal
        isOpen={isSuitableForChildrenModalOpen}
        onClose={handleClose}
        onOver18Click={onOver18Click}
        onUnder18Click={onUnder18Click}
      />

      <EmbedModal
        isOpen={isEmbedModalOpen}
        onClose={handleClose}
        embedContentType={content?.type || ''}
      />

      <AddToPlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={handleClose}
        contentId={content?.id || ''}
        profileId={loggedInProfileId || ''}
        userId={userId || ''}
      />

      <ReportContentModal
        isOpen={isReportContentModalOpen}
        onClose={handleClose}
      />

      <Grid container justifyContent="center">
        <Grid xs={12} md={9}>
          {isLoading ? (
            <MediaPlayerLoader type={mediaType ? mediaType : 'video'} />
          ) : youtubeID != '' ? (
            youtubeContent
          ) : content?.type === 'audio' ? (
            audioContent
          ) : content?.type === 'pdf' ? (
            pdfContent
          ) : content?.type === 'video' ? (
            videoContent
          ) : content?.type === 'link' ? (
            linkContent
          ) : null}

          <s.ContentWrapper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography component="h1" variant="h3">
                {content?.title}
              </Typography>

              {loggedInProfileId === profileId && (
                // <Box sx={{ marginLeft: 'auto', display: 'flex' }}>
                <s.EditDeleteWrapper>
                  <s.EditSubsButton
                    component={RouterLink}
                    to={`/subtitle-editor/${content?.id}`}
                  >
                    Edit Subtitles
                  </s.EditSubsButton>
                  <DeleteContentButton contentId={content?.id || ''} />
                </s.EditDeleteWrapper>
                // </Box>
              )}
            </Box>
            <Typography component="p" variant="body2" sx={{ my: 1 }}>
              {formattedCreatedDate}
            </Typography>

            {!isLoading && (
              <Stack
                direction="row"
                spacing={2}
                justifyContent="left"
                sx={{ my: 3, typography: 'body2' }}
              >
                {showEmbedModal && (
                  <s.ActionsWrapper>
                    <CodeIcon />
                    <s.Action to={''} onClick={openEmbedModal}>
                      Embed
                    </s.Action>
                  </s.ActionsWrapper>
                )}
                <s.ActionsWrapper>
                  <CodeIcon />
                  <s.Action to={''} onClick={openPlaylistModal}>
                    Add to Playlist
                  </s.Action>
                </s.ActionsWrapper>
                <s.ActionsWrapper>
                  <FlagIcon />
                  <s.Action to={''} onClick={openReportContentModal}>
                    Report Content
                  </s.Action>
                </s.ActionsWrapper>
              </Stack>
            )}

            <Typography
              component="p"
              variant="body1"
              sx={{ whiteSpace: 'pre-wrap' }}
            >
              {content?.description}
            </Typography>
          </s.ContentWrapper>
        </Grid>
        <Grid xs={10} md={3}>
          <s.Sidebar>
            {isLoading ? (
              <MediaMetaDataLoader />
            ) : (
              <>
                <Stack>
                  <Typography component="h5" variant="h5">
                    {t('Contributors')}
                  </Typography>
                  {content?.contributors &&
                    Object.entries(content?.contributors)
                      .sort(([roleA], [roleB]) => {
                        if (roleA === 'artist') {
                          return -1;
                        } else if (roleB === 'artist') {
                          return 1;
                        } else {
                          return roleA.localeCompare(roleB);
                        }
                      })
                      .map(([role, contributors]) => {
                        return (
                          <div key={role}>
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{
                                display: 'inline',
                                wordWrap: 'break-word',
                                fontSize: '16px',
                                color: theme.palette.primary.main
                              }}
                            >
                              {t(
                                getContributorRole(
                                  (contributors[0] as Contributor)
                                    ?.preferredTitle || role,
                                  contributors.length
                                )
                              )}
                              :&nbsp;
                            </Typography>

                            <Typography
                              component="span"
                              variant="body2"
                              sx={{
                                display: 'inline',
                                wordWrap: 'break-word',
                                fontWeight: '700',
                                lineHeight: '32px'
                              }}
                            >
                              {(contributors as Contributor[]).map(
                                (contributor, i) => (
                                  <span key={i}>
                                    {role === 'artist' && contributor.url ? (
                                      <Link
                                        href={contributor.url}
                                        sx={{ color: 'inherit' }}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        {contributor.name}
                                      </Link>
                                    ) : (
                                      contributor.name
                                    )}
                                    {i < contributors.length - 1 ? ', ' : ''}
                                  </span>
                                )
                              )}
                            </Typography>
                          </div>
                        );
                      })}
                </Stack>
                {content?.collaboratorDetails && (
                  <>
                    <s.Seperator />
                  </>
                )}

                {/* Technically these are the Collaborators, not the Contributors.  I keep mixing them up as well :)  */}
                <Contributors
                  contributors={
                    content?.collaboratorDetails as CollaboratorDetails[]
                  }
                />

                <s.Seperator />

                {(content?.tags?.length || 0) > 0 && (
                  <Stack>
                    <Typography component="h5" variant="h5">
                      {t('Tags')}
                    </Typography>
                    <s.Tags sx={{ display: 'flex' }}>
                      {(content?.tags || [])
                        .join(', ')
                        .split(', ')
                        .map((tag: string, index: number, array: string[]) => (
                          <React.Fragment key={tag}>
                            <s.Tag
                              component="span"
                              variant="body2"
                              underline="true"
                            >
                              {tag}
                              {index < array.length - 1 && ','}
                            </s.Tag>
                            {index < array.length - 1 && (
                              <s.Tag component="span" variant="body2">
                                &nbsp;
                              </s.Tag>
                            )}
                          </React.Fragment>
                        ))}
                    </s.Tags>
                    <s.Seperator />
                  </Stack>
                )}
                {(content?.languageTags?.length || 0) > 0 && (
                  <Stack>
                    <Typography component="h5" variant="h5">
                      {content?.languageTags && content?.languageTags.length > 1
                        ? t('Languages')
                        : t('Language')}
                    </Typography>
                    <s.Tags sx={{ display: 'flex' }}>
                      {(content?.languageTags || [])
                        .join(', ')
                        .split(', ')
                        .map((tag: string, index: number, array: string[]) => (
                          <React.Fragment key={tag}>
                            <s.Tag
                              component="span"
                              variant="body2"
                              underline="true"
                            >
                              {tag}
                              {index < array.length - 1 && ','}
                            </s.Tag>
                            {index < array.length - 1 && (
                              <s.Tag component="span" variant="body2">
                                &nbsp;
                              </s.Tag>
                            )}
                          </React.Fragment>
                        ))}
                    </s.Tags>
                  </Stack>
                )}
              </>
            )}

            <s.Seperator />
            {profileId && (
              <MoreContent
                profileId={profileId}
                excludeId={content?.id || ''}
                playlistId={playlistId || ''} // from query string for related content from same playlist
                tags={content?.tags || []}
              />
            )}
          </s.Sidebar>
        </Grid>
      </Grid>
      <Footer />
    </Box>
  );
};

export default Video;
