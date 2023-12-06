import React, { useEffect, useRef, useState } from 'react';
import MediaPlayer from 'components/MediaPlayer';
import YouTubePlayer from 'components/YouTubePlayer';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { Stack, Typography, useTheme, Box, Link } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import CodeIcon from '@mui/icons-material/Code';

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
import { OVER_18 } from 'constants/localStorage';
import { getIDfromURL } from 'utils/youtubeUtils';
import useDeleteContent from 'hooks/useDeleteContent';
import DeleteContentButton from 'components/DeleteContentButton';
import { getProfileId } from 'utils/auth';
import EmbedModal from 'components/EmbedModal';
import Lottie from 'lottie-react';
import LoadingCubes from 'assets/animations/loading-cubes.json';

const Video = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const contentRef = useRef<HTMLDivElement>(null);
  const { data: content, isLoading } = useContentDetails();
  const createdAt = content?.createdAt;
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
  const subtitleUrl = content?.vttFileUrl?.playerInfo?.publicUrl;
  const videoBeingProcessed = !content?.mediaUrl?.playerInfo?.hlsUrl;
  const audioBeingProcessed = !content?.mediaUrl?.playerInfo?.publicUrl;

  // check if user is running Safari - Safari won't display the poster for the audio player component.
  // workaround is to show the poster as a background image if isSafari is true

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

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

  function handleClose() {
    setIsSuitableForChildrenModalOpen(false);
    setIsEmbedModalOpen(false);
  }

  const openEmbedModal = () => {
    setIsEmbedModalOpen(true);
  };

  function getContributorRole(role: string, count: number): string {
    let roleStr = '';
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
    // Add 's' to role if there are multiple contributors
    return count > 1 ? roleStr + 's' : roleStr;
  }

  const youtubeContent = (
    <s.VideoWrapper>
      <YouTubePlayer id={youtubeID} />
    </s.VideoWrapper>
  );

  const audioContent = (
    <s.AudioWrapper>
      {audioBeingProcessed ? (
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
          isSafari={isSafari}
        />
      )}
    </s.AudioWrapper>
  );

  const pdfContent = <PDFReader url={pdfUrl || ''} />;

  const videoContent = (
    <s.VideoWrapper>
      {videoBeingProcessed ? (
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
                <Box sx={{ marginLeft: 'auto' }}>
                  <DeleteContentButton contentId={content?.id || ''} />
                </Box>
              )}
            </Box>
            <s.ContentDate component="p" variant="body2">
              {formattedCreatedDate}
            </s.ContentDate>

            <Stack direction="row" justifyContent="left">
              <s.EmbedWrapper>
                <CodeIcon />
                <s.Embed to={''} onClick={openEmbedModal}>
                  Embed
                </s.Embed>
              </s.EmbedWrapper>
            </Stack>

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
                              {t(getContributorRole(role, contributors.length))}
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
                  </Stack>
                )}
              </>
            )}

            <s.Seperator />
            {profileId && (
              <MoreContent
                profileId={profileId}
                excludeId={content?.id || ''}
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
